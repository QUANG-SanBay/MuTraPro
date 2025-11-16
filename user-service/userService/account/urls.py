from django.urls import path
from .views import (
    hello, 
    register, 
    login, 
    profile, 
    change_password,
    # Admin endpoints
    admin_get_all_users,
    admin_get_user_by_id,
    admin_update_user_status,
    admin_update_user,
    admin_create_user,
    check_role_access
)

urlpatterns = [
    path('hello', hello, name='hello'),
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('me', profile, name='profile'),  # Handles GET, PUT, PATCH
    path('change-password', change_password, name='change_password'),
    
    # Role check endpoint
    path('check-role', check_role_access, name='check_role'),
    
    # Admin endpoints (RBAC protected)
    path('admin/users', admin_get_all_users, name='admin_get_all_users'),
    path('admin/users/create', admin_create_user, name='admin_create_user'),
    path('admin/users/<int:user_id>', admin_get_user_by_id, name='admin_get_user_by_id'),
    path('admin/users/<int:user_id>/update', admin_update_user, name='admin_update_user'),
    path('admin/users/<int:user_id>/status', admin_update_user_status, name='admin_update_user_status'),
]
