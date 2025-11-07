from django.urls import path
from .views import hello, register, login, profile, change_password

urlpatterns = [
    path('hello', hello, name='hello'),
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('me', profile, name='profile'),  # Handles GET, PUT, PATCH
    path('change-password', change_password, name='change_password'),
]
