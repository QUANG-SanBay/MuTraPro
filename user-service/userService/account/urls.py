from django.urls import path
from .views import hello, register, login

urlpatterns = [
    path('hello', hello, name='hello'),
    path('register', register, name='register'),
    path('login', login, name='login'),
]
