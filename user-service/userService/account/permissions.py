from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permission check for Admin role only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsCustomer(BasePermission):
    """
    Permission check for Customer role only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'customer'


class IsServiceCoordinator(BasePermission):
    """
    Permission check for Service Coordinator role only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'service_coordinator'


class IsSpecialist(BasePermission):
    """
    Permission check for Specialist roles (transcription, arrangement, recording)
    """
    def has_permission(self, request, view):
        specialist_roles = ['transcription_specialist', 'arrangement_specialist', 'recording_artist']
        return request.user and request.user.is_authenticated and request.user.role in specialist_roles


class IsStudioAdministrator(BasePermission):
    """
    Permission check for Studio Administrator role only
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'studio_administrator'


class IsAdminOrStudioAdmin(BasePermission):
    """
    Permission check for Admin or Studio Administrator roles
    """
    def has_permission(self, request, view):
        admin_roles = ['admin', 'studio_administrator']
        return request.user and request.user.is_authenticated and request.user.role in admin_roles


class IsOwnerOrAdmin(BasePermission):
    """
    Permission check: Allow if user is the owner of the resource or an admin
    Object-level permission - requires has_object_permission
    """
    def has_permission(self, request, view):
        # Must be authenticated
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access anything
        if request.user.role == 'admin':
            return True
        
        # Check if obj has a user attribute and if it matches the requesting user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # If obj is the user itself
        if hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


def role_required(*allowed_roles):
    """
    Decorator factory to create custom permission classes for specific roles
    
    Usage:
        @permission_classes([IsAuthenticated, role_required('admin', 'customer')])
        def my_view(request):
            ...
    
    Args:
        *allowed_roles: Variable number of role strings that are allowed to access
    
    Returns:
        Permission class that checks if user has one of the allowed roles
    """
    class RolePermission(BasePermission):
        """
        Custom permission to check if user has one of the required roles
        """
        def has_permission(self, request, view):
            if not request.user or not request.user.is_authenticated:
                return False
            return request.user.role in allowed_roles
        
        def __repr__(self):
            return f"RolePermission({', '.join(allowed_roles)})"
    
    return RolePermission


class HasPermission(BasePermission):
    """
    Permission check based on granular permissions in RolePermission model.
    
    Usage in views:
        @permission_classes([IsAuthenticated, HasPermission])
        @require_permission('view_all_users')
        def my_view(request):
            ...
    """
    
    def has_permission(self, request, view):
        # Must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admin has all permissions
        if request.user.role == 'admin':
            return True
        
        # Check if view has required_permission attribute (set by decorator)
        required_perm = getattr(view, 'required_permission', None)
        
        if not required_perm:
            # No specific permission required, just authentication
            return True
        
        # Check if user's role has this permission
        from .models import RolePermission
        
        has_perm = RolePermission.objects.filter(
            role=request.user.role,
            permission__codename=required_perm
        ).exists()
        
        return has_perm


def require_permission(permission_codename):
    """
    Decorator to specify required permission for a view.
    
    Usage:
        @api_view(['GET'])
        @permission_classes([IsAuthenticated, HasPermission])
        @require_permission('view_all_users')
        def get_users(request):
            ...
    
    Args:
        permission_codename: The codename of the required permission
    
    Returns:
        Decorated view function with required_permission attribute
    """
    def decorator(view_func):
        view_func.required_permission = permission_codename
        return view_func
    return decorator

