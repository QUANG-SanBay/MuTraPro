"""
System Settings Views
Handles system-wide configuration management for admins only.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import SystemSettings
from .serializers import SystemSettingsSerializer


# Default settings for each category
DEFAULT_SETTINGS = {
    'general': {
        'siteName': 'MuTraPro',
        'siteDescription': 'Hệ thống quản lý chuyển soạn nhạc chuyên nghiệp',
        'contactEmail': 'contact@mutrapro.com',
        'supportPhone': '1900-xxxx',
        'timezone': 'Asia/Ho_Chi_Minh',
        'language': 'vi',
        'maintenanceMode': False
    },
    'email': {
        'smtpHost': 'smtp.gmail.com',
        'smtpPort': '587',
        'smtpUser': '',
        'smtpPassword': '',
        'fromEmail': 'noreply@mutrapro.com',
        'fromName': 'MuTraPro System',
        'enableEmailNotifications': True
    },
    'payment': {
        'vnpayEnabled': True,
        'vnpayTmnCode': '',
        'vnpayHashSecret': '',
        'momoEnabled': False,
        'momoPartnerCode': '',
        'momoAccessKey': '',
        'momoSecretKey': '',
        'bankTransferEnabled': True,
        'bankName': 'Vietcombank',
        'bankAccountNumber': '',
        'bankAccountName': ''
    },
    'storage': {
        'storageProvider': 'local',
        'localStoragePath': '/media',
        'maxFileSize': 100,
        'allowedFileTypes': '.mp3,.wav,.flac,.pdf,.doc,.docx',
        's3Enabled': False,
        's3Bucket': '',
        's3Region': 'ap-southeast-1',
        's3AccessKey': '',
        's3SecretKey': ''
    },
    'service': {
        'autoAssignTasks': True,
        'taskTimeout': 24,
        'allowCancellation': True,
        'cancellationDeadline': 2,
        'requireApproval': True,
        'maxRevisions': 3,
        'notifyOnStatusChange': True,
        'notifyOnNewOrder': True
    }
}


def is_admin(user):
    """Check if user is admin"""
    return user.is_authenticated and user.role == 'admin'


@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_settings(request):
    """
    Get public system settings (no auth required)
    GET /api/users/settings/public
    Only returns general settings that are safe to expose publicly
    """
    try:
        try:
            settings_obj = SystemSettings.objects.get(category='general')
            general_settings = settings_obj.settings_data
        except SystemSettings.DoesNotExist:
            general_settings = DEFAULT_SETTINGS['general']
        
        # Return only public-safe fields
        public_data = {
            'siteName': general_settings.get('siteName', 'MuTraPro'),
            'siteDescription': general_settings.get('siteDescription', ''),
            'contactEmail': general_settings.get('contactEmail', ''),
            'supportPhone': general_settings.get('supportPhone', ''),
            'timezone': general_settings.get('timezone', 'Asia/Ho_Chi_Minh'),
            'language': general_settings.get('language', 'vi')
            # Note: maintenanceMode is intentionally excluded from public API
        }
        
        return Response({
            'settings': public_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve public settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _get_all_settings_logic(request):
    """Internal logic for getting all settings"""
    if not is_admin(request.user):
        return Response(
            {'error': 'Only admins can access system settings'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        settings_dict = {}
        
        for category in DEFAULT_SETTINGS.keys():
            try:
                settings_obj = SystemSettings.objects.get(category=category)
                settings_dict[category] = settings_obj.settings_data
            except SystemSettings.DoesNotExist:
                # Return default if not found
                settings_dict[category] = DEFAULT_SETTINGS[category]
        
        return Response({
            'settings': settings_dict
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _update_settings_logic(request):
    """Internal logic for updating all settings"""
    if not is_admin(request.user):
        return Response(
            {'error': 'Only admins can update system settings'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        with transaction.atomic():
            updated_settings = {}
            
            for category, settings_data in request.data.items():
                if category not in DEFAULT_SETTINGS:
                    continue
                
                settings_obj, created = SystemSettings.objects.get_or_create(
                    category=category,
                    defaults={'settings_data': settings_data}
                )
                
                if not created:
                    settings_obj.settings_data = settings_data
                    settings_obj.updated_by = request.user
                    settings_obj.save()
                
                updated_settings[category] = settings_obj.settings_data
            
            return Response({
                'message': 'Settings updated successfully',
                'settings': updated_settings
            }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to update settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_all_settings(request):
    """
    Handle both GET and PUT for /admin/settings
    GET: Retrieve all settings
    PUT: Update all settings
    """
    if request.method == 'GET':
        return _get_all_settings_logic(request)
    elif request.method == 'PUT':
        return _update_settings_logic(request)


def _get_settings_by_category_logic(request, category):
    """Internal logic for getting settings by category"""
    if not is_admin(request.user):
        return Response(
            {'error': 'Only admins can access system settings'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if category not in DEFAULT_SETTINGS:
        return Response(
            {'error': f'Invalid category: {category}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        try:
            settings_obj = SystemSettings.objects.get(category=category)
            settings_data = settings_obj.settings_data
        except SystemSettings.DoesNotExist:
            # Return default if not found
            settings_data = DEFAULT_SETTINGS[category]
        
        return Response({
            'category': category,
            'settings': settings_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _update_settings_by_category_logic(request, category):
    """Internal logic for updating settings by category"""
    if not is_admin(request.user):
        return Response(
            {'error': 'Only admins can update system settings'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if category not in DEFAULT_SETTINGS:
        return Response(
            {'error': f'Invalid category: {category}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        settings_obj, created = SystemSettings.objects.get_or_create(
            category=category,
            defaults={'settings_data': request.data}
        )
        
        if not created:
            settings_obj.settings_data = request.data
            settings_obj.updated_by = request.user
            settings_obj.save()
        
        return Response({
            'message': f'{category} settings updated successfully',
            'category': category,
            'settings': settings_obj.settings_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to update settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_settings_by_category(request, category):
    """
    Handle both GET and PUT for /admin/settings/<category>
    GET: Retrieve settings for specific category
    PUT: Update settings for specific category
    """
    if request.method == 'GET':
        return _get_settings_by_category_logic(request, category)
    elif request.method == 'PUT':
        return _update_settings_by_category_logic(request, category)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_settings_to_default(request, category):
    """
    Reset settings for a specific category to default values
    POST /api/users/admin/settings/<category>/reset
    """
    if not is_admin(request.user):
        return Response(
            {'error': 'Only admins can reset system settings'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if category not in DEFAULT_SETTINGS:
        return Response(
            {'error': f'Invalid category: {category}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        settings_obj, created = SystemSettings.objects.get_or_create(
            category=category,
            defaults={'settings_data': DEFAULT_SETTINGS[category]}
        )
        
        if not created:
            settings_obj.settings_data = DEFAULT_SETTINGS[category]
            settings_obj.updated_by = request.user
            settings_obj.save()
        
        return Response({
            'message': f'{category} settings reset to default',
            'category': category,
            'settings': settings_obj.settings_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Failed to reset settings: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
