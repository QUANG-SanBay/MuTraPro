from django.db import models
from django.contrib.auth.models import AbstractUser


class Gender(models.TextChoices):
	MALE = "male", "Nam"
	FEMALE = "female", "Nữ"
	OTHER = "other", "Khác"


class Role(models.TextChoices):
	CUSTOMER = "customer", "Customer"
	SERVICE_COORDINATOR = "service_coordinator", "Service Coordinator"
	TRANSCRIPTION_SPECIALIST = (
		"transcription_specialist",
		"Transcription Specialist",
	)
	ARRANGEMENT_SPECIALIST = (
		"arrangement_specialist",
		"Arrangement Specialist",
	)
	RECORDING_ARTIST = "recording_artist", "Recording Artist"
	STUDIO_ADMINISTRATOR = "studio_administrator", "Studio Administrator"
	ADMIN = "admin", "Admin"


class User(AbstractUser):
	"""
	Core user entity derived from the class diagram.

	Fields mapped from diagram:
	- username (inherited)
	- passwordHash -> password (hash stored by Django)
	- email (inherited)
	- fullName -> full_name
	- phoneNumber -> phone_number
	- gioiTinh -> gender
	- role -> role
	"""

	full_name = models.CharField(max_length=255)
	phone_number = models.CharField(max_length=20, blank=True)
	gender = models.CharField(
		max_length=10, choices=Gender.choices, default=Gender.MALE
	)
	role = models.CharField(
		max_length=32, choices=Role.choices, default=Role.CUSTOMER
	)

	# Common audit fields
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "User"
		verbose_name_plural = "Users"
		indexes = [
			models.Index(fields=["username"]),
			models.Index(fields=["email"]),
		]

	def __str__(self) -> str:
		return f"{self.username} ({self.get_role_display()})"

	# Diagram-inspired helper methods
	def update_profile(self, **fields):
		for k, v in fields.items():
			if hasattr(self, k):
				setattr(self, k, v)
		self.save(update_fields=list(fields.keys()) + ["updated_at"])  # type: ignore
		return self

	def change_password(self, raw_password: str):
		self.set_password(raw_password)
		self.save(update_fields=["password", "updated_at"])  # type: ignore
		return self


class SpecialistType(models.TextChoices):
	RECORDING_ARTIST = "recording_artist", "Recording Artist"
	TRANSCRIPTION_SPECIALIST = "transcription_specialist", "Transcription Specialist"
	ARRANGEMENT_SPECIALIST = "arrangement_specialist", "Arrangement Specialist"


class SpecialistProfile(models.Model):
	"""Profile for specialist roles (Recording/Transcription/Arrangement)."""

	user = models.OneToOneField(
		User, on_delete=models.CASCADE, related_name="specialist_profile"
	)
	type = models.CharField(max_length=32, choices=SpecialistType.choices)
	active = models.BooleanField(default=True)
	notes = models.TextField(blank=True)

	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Specialist Profile"
		verbose_name_plural = "Specialist Profiles"

	def __str__(self) -> str:
		return f"{self.user.username} - {self.get_type_display()}"


class ServiceCoordinatorProfile(models.Model):
	user = models.OneToOneField(
		User, on_delete=models.CASCADE, related_name="service_coordinator_profile"
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"Service Coordinator: {self.user.username}"


class StudioAdministratorProfile(models.Model):
	user = models.OneToOneField(
		User, on_delete=models.CASCADE, related_name="studio_administrator_profile"
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"Studio Admin: {self.user.username}"


class AdminProfile(models.Model):
	user = models.OneToOneField(
		User, on_delete=models.CASCADE, related_name="admin_profile"
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"Admin: {self.user.username}"


class CustomerProfile(models.Model):
	user = models.OneToOneField(
		User, on_delete=models.CASCADE, related_name="customer_profile"
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"Customer: {self.user.username}"

