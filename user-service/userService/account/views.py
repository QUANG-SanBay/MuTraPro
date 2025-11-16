from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, UpdateProfileSerializer, ChangePasswordSerializer
from .permissions import IsAdmin, IsCustomer, role_required


def hello(request):
	"""
	Simple health-style endpoint to verify user-service via gateway.
	GET /api/hello -> { message, service, time }
	"""
	return JsonResponse(
		{
			"message": "Xin chao tu user-service",
			"service": "user-service",
			"time": datetime.utcnow().isoformat() + "Z",
		}
	)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
	"""
	User registration endpoint
	POST /users/register
	
	Request body:
	{
		"email": "string",
		"full_name": "string",
		"password": "string",
		"re_password": "string"
	}
	
	Response (Success):
	{
		"message": "Đăng ký thành công",
		"user": {
			"id": int,
			"username": "string (auto-generated)",
			"email": "string",
			"full_name": "string",
			"role": "customer"
		}
	}
	"""
	serializer = RegisterSerializer(data=request.data)
	
	if serializer.is_valid():
		user = serializer.save()
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Đăng ký thành công",
			"user": user_data
		}, status=status.HTTP_201_CREATED)
	
	return Response({
		"message": "Đăng ký thất bại",
		"errors": serializer.errors
	}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
	"""
	User login endpoint
	POST /users/login
	
	Request body:
	{
		"email": "string",
		"password": "string"
	}
	
	Response (Success):
	{
		"message": "Đăng nhập thành công",
		"user": {
			"id": int,
			"username": "string",
			"email": "string",
			"full_name": "string",
			"role": "customer"
		},
		"access": "jwt_access_token",
		"refresh": "jwt_refresh_token"
	}
	"""
	serializer = LoginSerializer(data=request.data)
	
	if serializer.is_valid():
		# Get validated user from serializer
		user = serializer.validated_data['user']
		
		# Generate JWT tokens
		refresh = RefreshToken.for_user(user)
		
		# Add custom claims to token
		refresh['email'] = user.email
		refresh['role'] = user.role
		
		# Return user data and tokens
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Đăng nhập thành công",
			"user": user_data,
			"access": str(refresh.access_token),
			"refresh": str(refresh)
		}, status=status.HTTP_200_OK)
	
	return Response({
		"message": "Đăng nhập thất bại",
		"errors": serializer.errors
	}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
	"""
	User profile endpoint - Requires JWT authentication
	GET /users/me - Get user profile
	PUT/PATCH /users/me - Update user profile
	
	Headers:
	{
		"Authorization": "Bearer <access_token>"
	}
	
	GET Response (Success):
	{
		"message": "Lấy thông tin thành công",
		"user": {
			"id": int,
			"username": "string",
			"email": "string",
			"full_name": "string",
			"phone_number": "string",
			"gender": "male|female|other",
			"role": "customer|admin|...",
			"is_active": bool,
			"created_at": "datetime"
		}
	}
	
	PUT/PATCH Request body:
	{
		"full_name": "string (optional)",
		"phone_number": "string (optional)",
		"gender": "male|female|other (optional)"
	}
	
	PUT/PATCH Response (Success):
	{
		"message": "Cập nhật thông tin thành công",
		"user": {
			"id": int,
			"username": "string",
			"email": "string",
			"full_name": "string",
			"phone_number": "string",
			"gender": "male|female|other",
			"role": "customer|admin|...",
			"is_active": bool,
			"created_at": "datetime"
		}
	}
	"""
	user = request.user
	
	if request.method == 'GET':
		# Get profile
		user_data = UserSerializer(user).data
		return Response({
			"message": "Lấy thông tin thành công",
			"user": user_data
		}, status=status.HTTP_200_OK)
	
	elif request.method in ['PUT', 'PATCH']:
		# Update profile
		serializer = UpdateProfileSerializer(user, data=request.data, partial=True)
		
		if serializer.is_valid():
			updated_user = serializer.save()
			user_data = UserSerializer(updated_user).data
			
			return Response({
				"message": "Cập nhật thông tin thành công",
				"user": user_data
			}, status=status.HTTP_200_OK)
		
		return Response({
			"message": "Cập nhật thông tin thất bại",
			"errors": serializer.errors
		}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
	"""
	Change user password endpoint - Requires JWT authentication
	PUT /users/change-password
	
	Headers:
	{
		"Authorization": "Bearer <access_token>"
	}
	
	Request body:
	{
		"old_password": "string",
		"new_password": "string",
		"confirm_password": "string"
	}
	
	Response (Success):
	{
		"message": "Đổi mật khẩu thành công"
	}
	
	Response (Error):
	{
		"message": "Đổi mật khẩu thất bại",
		"errors": {
			"old_password": ["Mật khẩu cũ không chính xác"],
			"new_password": ["Mật khẩu mới phải khác mật khẩu cũ"],
			"confirm_password": ["Mật khẩu xác nhận không khớp"]
		}
	}
	"""
	user = request.user
	serializer = ChangePasswordSerializer(data=request.data)
	
	if serializer.is_valid():
		old_password = serializer.validated_data['old_password']
		new_password = serializer.validated_data['new_password']
		
		# Verify old password
		if not user.check_password(old_password):
			return Response({
				"message": "Đổi mật khẩu thất bại",
				"errors": {
					"old_password": ["Mật khẩu cũ không chính xác"]
				}
			}, status=status.HTTP_400_BAD_REQUEST)
		
		# Set new password (Django will hash it automatically)
		user.set_password(new_password)
		user.save()
		
		return Response({
			"message": "Đổi mật khẩu thành công"
		}, status=status.HTTP_200_OK)
	
		return Response({
			"message": "Đổi mật khẩu thất bại",
			"errors": serializer.errors
		}, status=status.HTTP_400_BAD_REQUEST)


# ==================== ADMIN ENDPOINTS (RBAC Example) ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_get_all_users(request):
	"""
	Admin endpoint - Get all users
	GET /users/admin/users
	
	Requires: Admin role
	
	Response:
	{
		"message": "Lấy danh sách người dùng thành công",
		"total": int,
		"users": [
			{
				"id": int,
				"username": "string",
				"email": "string",
				"full_name": "string",
				"role": "string",
				"is_active": bool,
				"created_at": "datetime"
			},
			...
		]
	}
	"""
	from .models import User
	
	users = User.objects.all().order_by('-created_at')
	users_data = UserSerializer(users, many=True).data
	
	return Response({
		"message": "Lấy danh sách người dùng thành công",
		"total": users.count(),
		"users": users_data
	}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated, role_required('admin', 'studio_administrator')])
def admin_get_user_by_id(request, user_id):
	"""
	Admin/Studio Admin endpoint - Get user by ID
	GET /users/admin/users/{user_id}
	
	Requires: Admin or Studio Administrator role
	
	Response:
	{
		"message": "Lấy thông tin người dùng thành công",
		"user": {
			"id": int,
			"username": "string",
			"email": "string",
			"full_name": "string",
			"phone_number": "string",
			"gender": "string",
			"role": "string",
			"is_active": bool,
			"created_at": "datetime",
			"updated_at": "datetime"
		}
	}
	"""
	from .models import User
	
	try:
		user = User.objects.get(id=user_id)
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Lấy thông tin người dùng thành công",
			"user": user_data
		}, status=status.HTTP_200_OK)
	except User.DoesNotExist:
		return Response({
			"message": "Người dùng không tồn tại"
		}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_update_user_status(request, user_id):
	"""
	Admin endpoint - Update user active status
	PUT /users/admin/users/{user_id}/status
	
	Requires: Admin role
	
	Request body:
	{
		"is_active": bool
	}
	
	Response:
	{
		"message": "Cập nhật trạng thái người dùng thành công",
		"user": {...}
	}
	"""
	from .models import User
	
	try:
		user = User.objects.get(id=user_id)
		is_active = request.data.get('is_active')
		
		if is_active is None:
			return Response({
				"message": "Thiếu trường is_active"
			}, status=status.HTTP_400_BAD_REQUEST)
		
		user.is_active = is_active
		user.save()
		
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Cập nhật trạng thái người dùng thành công",
			"user": user_data
		}, status=status.HTTP_200_OK)
	except User.DoesNotExist:
		return Response({
			"message": "Người dùng không tồn tại"
		}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_update_user(request, user_id):
	"""
	Admin endpoint - Update user information
	PUT/PATCH /users/admin/users/{user_id}
	
	Requires: Admin role
	
	Request body:
	{
		"email": "string (optional)",
		"full_name": "string (optional)",
		"phone_number": "string (optional)",
		"gender": "string (optional)",
		"role": "string (optional)",
		"password": "string (optional)",
		"re_password": "string (optional, required if password is set)"
	}
	
	Response:
	{
		"message": "Cập nhật thông tin người dùng thành công",
		"user": {...}
	}
	"""
	from .models import User
	
	try:
		user = User.objects.get(id=user_id)
		
		# Update basic fields
		if 'email' in request.data:
			email = request.data['email']
			# Check if email already exists (exclude current user)
			if User.objects.filter(email=email).exclude(id=user_id).exists():
				return Response({
					"message": "Cập nhật thông tin thất bại",
					"errors": {
						"email": ["Email đã tồn tại"]
					}
				}, status=status.HTTP_400_BAD_REQUEST)
			user.email = email
		
		if 'full_name' in request.data:
			user.full_name = request.data['full_name']
		
		if 'phone_number' in request.data:
			user.phone_number = request.data['phone_number']
		
		if 'gender' in request.data:
			user.gender = request.data['gender']
		
		if 'role' in request.data:
			user.role = request.data['role']
		
		# Update password if provided
		if 'password' in request.data and request.data['password']:
			password = request.data['password']
			re_password = request.data.get('re_password', '')
			
			# Validate password match
			if password != re_password:
				return Response({
					"message": "Cập nhật thông tin thất bại",
					"errors": {
						"re_password": ["Mật khẩu không khớp"]
					}
				}, status=status.HTTP_400_BAD_REQUEST)
			
			# Validate password length
			if len(password) < 6:
				return Response({
					"message": "Cập nhật thông tin thất bại",
					"errors": {
						"password": ["Mật khẩu phải có ít nhất 6 ký tự"]
					}
				}, status=status.HTTP_400_BAD_REQUEST)
			
			user.set_password(password)
		
		user.save()
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Cập nhật thông tin người dùng thành công",
			"user": user_data
		}, status=status.HTTP_200_OK)
	except User.DoesNotExist:
		return Response({
			"message": "Người dùng không tồn tại"
		}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_create_user(request):
	"""
	Admin endpoint - Create new user
	POST /users/admin/users
	
	Requires: Admin role
	
	Request body:
	{
		"email": "string",
		"full_name": "string",
		"password": "string",
		"re_password": "string",
		"phone_number": "string (optional)",
		"gender": "string (optional)",
		"role": "string (optional, default: customer)"
	}
	
	Response:
	{
		"message": "Tạo người dùng mới thành công",
		"user": {...}
	}
	"""
	serializer = RegisterSerializer(data=request.data)
	
	if serializer.is_valid():
		user = serializer.save()
		
		# Update role if provided
		if 'role' in request.data:
			user.role = request.data['role']
			user.save()
		
		user_data = UserSerializer(user).data
		
		return Response({
			"message": "Tạo người dùng mới thành công",
			"user": user_data
		}, status=status.HTTP_201_CREATED)
	
	return Response({
		"message": "Tạo người dùng thất bại",
		"errors": serializer.errors
	}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_role_access(request):
	"""
	Test endpoint - Check current user's role and permissions
	GET /users/check-role
	
	Requires: Any authenticated user
	
	Response:
	{
		"message": "Thông tin vai trò người dùng",
		"user_id": int,
		"username": "string",
		"role": "string",
		"permissions": {
			"can_access_admin": bool,
			"can_access_customer": bool,
			"can_access_specialist": bool
		}
	}
	"""
	user = request.user
	
	return Response({
		"message": "Thông tin vai trò người dùng",
		"user_id": user.id,
		"username": user.username,
		"email": user.email,
		"role": user.role,
		"permissions": {
			"can_access_admin": user.role == 'admin',
			"can_access_customer": user.role == 'customer',
			"can_access_service_coordinator": user.role == 'service_coordinator',
			"can_access_specialist": user.role in ['transcription_specialist', 'arrangement_specialist', 'recording_artist'],
			"can_access_studio_admin": user.role == 'studio_administrator'
		}
	}, status=status.HTTP_200_OK)
