from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer


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
