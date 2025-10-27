from django.http import JsonResponse
from datetime import datetime


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
