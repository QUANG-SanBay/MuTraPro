from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
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
        fields = ('email', 'full_name', 'password', 're_password', 'phone_number', 'gender')
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True},
            'phone_number': {'required': False},
            'gender': {'required': False}
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
            phone_number=validated_data.get('phone_number', ''),
            gender=validated_data.get('gender', ''),
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


class LoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """Validate credentials and return user if valid"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "email": "Email hoặc mật khẩu không chính xác."
            })
        
        # Check if user is active
        if not user.is_active:
            raise serializers.ValidationError({
                "email": "Tài khoản của bạn đã bị vô hiệu hóa."
            })
        
        # Verify password using Django's check_password
        if not user.check_password(password):
            raise serializers.ValidationError({
                "password": "Email hoặc mật khẩu không chính xác."
            })
        
        # Attach user to validated data for view to access
        attrs['user'] = user
        return attrs


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = ('full_name', 'phone_number', 'gender')
        extra_kwargs = {
            'full_name': {'required': False},
            'phone_number': {'required': False},
            'gender': {'required': False}
        }
    
    def validate_phone_number(self, value):
        """Validate phone number format"""
        if value and not value.isdigit():
            raise serializers.ValidationError("Số điện thoại chỉ được chứa chữ số.")
        if value and (len(value) < 10 or len(value) > 11):
            raise serializers.ValidationError("Số điện thoại phải có 10-11 chữ số.")
        return value
    
    def update(self, instance, validated_data):
        """Update user profile fields"""
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.save()
        return instance


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing user password"""
    
    old_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate_old_password(self, value):
        """Validate that old password is provided"""
        if not value:
            raise serializers.ValidationError("Mật khẩu cũ là bắt buộc")
        return value
    
    def validate(self, attrs):
        """Validate password match and strength"""
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        
        # Check if new passwords match
        if new_password != confirm_password:
            raise serializers.ValidationError({
                "confirm_password": "Mật khẩu xác nhận không khớp"
            })
        
        # Check if new password is different from old password
        if old_password == new_password:
            raise serializers.ValidationError({
                "new_password": "Mật khẩu mới phải khác mật khẩu cũ"
            })
        
        # Validate new password strength using Django's validators
        try:
            validate_password(new_password)
        except ValidationError as e:
            raise serializers.ValidationError({
                "new_password": list(e.messages)
            })
        
        return attrs


class PermissionSerializer(serializers.Serializer):
    """Serializer for Permission model"""
    
    codename = serializers.CharField(max_length=100)
    name = serializers.CharField(max_length=200)
    category = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        fields = ['codename', 'name', 'category', 'description']


class RolePermissionSerializer(serializers.Serializer):
    """Serializer for retrieving role permissions"""
    
    role = serializers.CharField()
    permissions = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of permission codenames"
    )
    
    class Meta:
        fields = ['role', 'permissions']


class UpdateRolePermissionSerializer(serializers.Serializer):
    """Serializer for updating role permissions"""
    
    permissions = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of permission codenames to assign to the role"
    )
    
    def validate_permissions(self, value):
        """Validate that all permission codenames exist"""
        from .models import Permission
        
        existing_codenames = set(Permission.objects.filter(
            codename__in=value
        ).values_list('codename', flat=True))
        
        invalid_codenames = set(value) - existing_codenames
        
        if invalid_codenames:
            raise serializers.ValidationError(
                f"Invalid permission codenames: {', '.join(invalid_codenames)}"
            )
        
        return value
    
    class Meta:
        fields = ['permissions']

