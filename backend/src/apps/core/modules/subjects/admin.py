from django.contrib import admin

from .models import Subject

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = (
        "school",
        "grade",
        "name",
        "code",
        "is_active"
    )

    search_fields = ("school__name", "grade__name", "name", "code")

    list_filter = ("is_active", "school")

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "school",
                    "grade",
                    "name",
                    "code",
                    "description",
                    "is_active",
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
