from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, UpdateProfileSerializer


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
