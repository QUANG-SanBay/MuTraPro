from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import (
	User,
	SpecialistProfile,
	ServiceCoordinatorProfile,
	StudioAdministratorProfile,
	AdminProfile,
	CustomerProfile,
)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
	fieldsets = (
		(None, {"fields": ("username", "password")}),
		("Personal info", {"fields": ("full_name", "email", "phone_number", "gender")}),
		("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
		("Important dates", {"fields": ("last_login", "date_joined")}),
		("Business", {"fields": ("role",)}),
	)
	list_display = ("username", "email", "full_name", "role", "is_active")
	search_fields = ("username", "email", "full_name")
	ordering = ("username",)


admin.site.register(SpecialistProfile)
admin.site.register(ServiceCoordinatorProfile)
admin.site.register(StudioAdministratorProfile)
admin.site.register(AdminProfile)
admin.site.register(CustomerProfile)
