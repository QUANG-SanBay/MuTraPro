from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, CustomerProfile
import random


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    re_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 're_password')
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True}
        }
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email này đã được sử dụng.")
        return value
    
    def _generate_username(self, email):
        """Generate unique username from email + 4 random digits"""
        base_username = email.split('@')[0]
        
        # Try generating unique username
        for _ in range(10):  # Max 10 attempts
            random_digits = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            username = f"{base_username}{random_digits}"
            
            if not User.objects.filter(username=username).exists():
                return username
        
        # If still not unique, use timestamp
        import time
        timestamp = str(int(time.time()))[-4:]
        return f"{base_username}{timestamp}"
    
    def validate(self, attrs):
        """Validate password match and strength"""
        password = attrs.get('password')
        re_password = attrs.pop('re_password', None)
        
        # Check if passwords match
        if password != re_password:
            raise serializers.ValidationError({
                "re_password": "Mật khẩu nhập lại không khớp."
            })
        
        # Validate password strength using Django's validators
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })
        
        return attrs
    
    def create(self, validated_data):
        """Create new user with hashed password and auto-generated username"""
        email = validated_data['email']
        
        # Auto-generate username from email + 4 random digits
        username = self._generate_username(email)
        
        # Create user with hashed password
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role='customer',  # Default role
            is_active=True    # Active by default
        )
        
        # Create customer profile
        CustomerProfile.objects.create(user=user)
        
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'full_name', 'phone_number', 
                  'gender', 'role', 'is_active', 'created_at')
        read_only_fields = ('id', 'role', 'is_active', 'created_at')
