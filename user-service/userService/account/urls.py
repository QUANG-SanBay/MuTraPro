from django.urls import path
from .views import hello, register, login, get_profile

urlpatterns = [
    path('hello', hello, name='hello'),
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('me', get_profile, name='get_profile'),
]
