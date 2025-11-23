"""
Views for permission management.
Provides REST APIs for managing role-based permissions.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.core.exceptions import ValidationError
import logging

from .models import Permission, RolePermission, Role, User
from .serializers import (
    PermissionSerializer,
    RolePermissionSerializer,
    UpdateRolePermissionSerializer
)

logger = logging.getLogger(__name__)


def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and user.role == Role.ADMIN


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_permissions(request):
    """
    GET /api/permissions/
    
    Get all available permissions in the system.
    Returns a list of all permissions with their details.
    
    Response:
    {
        "permissions": [
            {
                "codename": "view_own_profile",
                "name": "Xem hồ sơ cá nhân",
                "category": "Tài khoản | Hồ sơ",
                "description": ""
            },
            ...
        ]
    }
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Chỉ admin mới có quyền truy cập'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    permissions = Permission.objects.all().order_by('category', 'name')
    serializer = PermissionSerializer(permissions, many=True)
    
    return Response({
        'permissions': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_roles(request):
    """
    GET /api/roles/
    
    Get all available roles in the system (excluding admin).
    
    Response:
    {
        "roles": [
            {"value": "customer", "label": "Customer"},
            ...
        ]
    }
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Chỉ admin mới có quyền truy cập'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Exclude admin role from management
    roles = [
        {"value": choice[0], "label": choice[1]}
        for choice in Role.choices
        if choice[0] != Role.ADMIN
    ]
    
    return Response({
        'roles': roles
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_role_permissions(request, role):
    """
    GET /api/roles/{role}/permissions/
    
    Get all permissions assigned to a specific role.
    
    Path params:
    - role: Role name (e.g., 'customer', 'service_coordinator')
    
    Response:
    {
        "role": "customer",
        "permissions": ["view_own_profile", "edit_own_profile", ...]
    }
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Chỉ admin mới có quyền truy cập'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Validate role exists
    valid_roles = [choice[0] for choice in Role.choices]
    if role not in valid_roles:
        return Response(
            {'error': f'Vai trò không hợp lệ: {role}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get permissions for this role
    permission_codenames = RolePermission.objects.filter(
        role=role
    ).values_list('permission__codename', flat=True)
    
    data = {
        'role': role,
        'permissions': list(permission_codenames)
    }
    
    serializer = RolePermissionSerializer(data)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_role_permissions(request, role):
    """
    PUT /api/roles/{role}/permissions/
    
    Update permissions for a specific role.
    Replaces all existing permissions with the new list.
    
    Path params:
    - role: Role name (e.g., 'customer', 'service_coordinator')
    
    Request body:
    {
        "permissions": ["view_own_profile", "edit_own_profile", ...]
    }
    
    Response:
    {
        "message": "Cập nhật quyền thành công",
        "role": "customer",
        "permissions": ["view_own_profile", ...],
        "added": 5,
        "removed": 2
    }
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Chỉ admin mới có quyền truy cập'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Validate role exists
    valid_roles = [choice[0] for choice in Role.choices]
    if role not in valid_roles:
        return Response(
            {'error': f'Vai trò không hợp lệ: {role}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Prevent modifying admin role
    if role == Role.ADMIN:
        return Response(
            {'error': 'Không thể thay đổi quyền của vai trò Admin'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Validate request data
    serializer = UpdateRolePermissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    permission_codenames = serializer.validated_data['permissions']
    
    try:
        with transaction.atomic():
            # Get current permissions
            current_permissions = set(
                RolePermission.objects.filter(role=role).values_list(
                    'permission__codename', flat=True
                )
            )
            
            new_permissions = set(permission_codenames)
            
            # Calculate changes
            to_add = new_permissions - current_permissions
            to_remove = current_permissions - new_permissions
            
            # Remove old permissions
            if to_remove:
                RolePermission.objects.filter(
                    role=role,
                    permission__codename__in=to_remove
                ).delete()
            
            # Add new permissions
            if to_add:
                permissions_to_create = []
                permission_objects = Permission.objects.filter(
                    codename__in=to_add
                )
                
                for perm_obj in permission_objects:
                    permissions_to_create.append(
                        RolePermission(
                            role=role,
                            permission=perm_obj,
                            created_by=request.user
                        )
                    )
                
                RolePermission.objects.bulk_create(permissions_to_create)
            
            logger.info(
                f"✅ Admin {request.user.username} updated permissions for role {role}: "
                f"+{len(to_add)} -{len(to_remove)}"
            )
            
            return Response({
                'message': 'Cập nhật quyền thành công',
                'role': role,
                'permissions': permission_codenames,
                'added': len(to_add),
                'removed': len(to_remove)
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"❌ Error updating role permissions: {e}")
        return Response(
            {'error': 'Có lỗi xảy ra khi cập nhật quyền'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_role_to_default(request, role):
    """
    POST /api/roles/{role}/reset-default/
    
    Reset role permissions to default values.
    Uses the DEFAULT_ROLE_PERMISSIONS mapping.
    
    Path params:
    - role: Role name (e.g., 'customer', 'service_coordinator')
    
    Response:
    {
        "message": "Đã khôi phục quyền mặc định",
        "role": "customer",
        "permissions": ["view_own_profile", ...]
    }
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Chỉ admin mới có quyền truy cập'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Validate role exists
    valid_roles = [choice[0] for choice in Role.choices]
    if role not in valid_roles:
        return Response(
            {'error': f'Vai trò không hợp lệ: {role}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Prevent resetting admin role
    if role == Role.ADMIN:
        return Response(
            {'error': 'Không thể reset quyền của vai trò Admin'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        from .management.commands.seed_permissions import DEFAULT_ROLE_PERMISSIONS
        
        default_permissions = DEFAULT_ROLE_PERMISSIONS.get(role, [])
        
        if not default_permissions:
            return Response(
                {'error': f'Không tìm thấy quyền mặc định cho vai trò {role}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        with transaction.atomic():
            # Delete all current permissions for this role
            RolePermission.objects.filter(role=role).delete()
            
            # Add default permissions
            permission_objects = Permission.objects.filter(
                codename__in=default_permissions
            )
            
            permissions_to_create = [
                RolePermission(
                    role=role,
                    permission=perm_obj,
                    created_by=request.user
                )
                for perm_obj in permission_objects
            ]
            
            RolePermission.objects.bulk_create(permissions_to_create)
            
            logger.info(
                f"✅ Admin {request.user.username} reset permissions for role {role} "
                f"to default ({len(permissions_to_create)} permissions)"
            )
            
            return Response({
                'message': 'Đã khôi phục quyền mặc định',
                'role': role,
                'permissions': default_permissions
            }, status=status.HTTP_200_OK)
    
    except ImportError:
        return Response(
            {'error': 'Không thể tải quyền mặc định. Vui lòng chạy seed_permissions command trước.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.error(f"❌ Error resetting role permissions: {e}")
        return Response(
            {'error': 'Có lỗi xảy ra khi reset quyền'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_user_permission(request):
    """
    GET /api/permissions/check/?permission=view_own_profile
    
    Check if current user has a specific permission.
    
    Query params:
    - permission: Permission codename to check
    
    Response:
    {
        "has_permission": true,
        "permission": "view_own_profile",
        "user_role": "customer"
    }
    """
    permission_codename = request.GET.get('permission')
    
    if not permission_codename:
        return Response(
            {'error': 'Missing permission parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user_role = request.user.role
    
    # Admin has all permissions
    if user_role == Role.ADMIN:
        has_permission = True
    else:
        has_permission = RolePermission.objects.filter(
            role=user_role,
            permission__codename=permission_codename
        ).exists()
    
    return Response({
        'has_permission': has_permission,
        'permission': permission_codename,
        'user_role': user_role
    }, status=status.HTTP_200_OK)
