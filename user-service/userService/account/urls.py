from django.urls import path
from .views import hello, register, login, profile

urlpatterns = [
    path('hello', hello, name='hello'),
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('me', profile, name='profile'),  # Handles GET, PUT, PATCH
]
