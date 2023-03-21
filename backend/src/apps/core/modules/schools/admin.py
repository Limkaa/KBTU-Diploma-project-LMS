from django.contrib import admin

from .models import School

@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ("name",)

    search_fields = ("name", "address")

    fieldsets = (
        (
            "School information",
            {
                "fields": (
                    "name",
                    "address",
                    "description"
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at"
                )
            },
        ),
    )
    
    readonly_fields = ["created_at", "updated_at"]
