from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "email",
        "fullname",
        "role",
        "is_staff",
        "is_superuser",
        "is_active",
        "date_joined",
    )

    search_fields = ("email", "fullname")

    list_filter = ("is_active", "is_staff", "is_superuser", "role", "gender")

    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "email",
                    "role",
                    "first_name",
                    "last_name",
                    "school",
                    "date_of_birth",
                    "gender",
                )
            },
        ),
        ("Additional", {"fields": ("phone", "telegram_id", "avatar", "rating")}),
        ("Booleans", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Timestamps", {"fields": ("date_joined",)}),
    )

    readonly_fields = ("date_joined", "rating", "telegram_id")

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return (
                *self.readonly_fields,
                "role",
            )
        return self.readonly_fields
