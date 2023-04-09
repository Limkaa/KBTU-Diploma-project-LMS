from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Assignment


@admin.register(Assignment)
class AssignmentAdmin(CustomModelAdmin):
    model = Assignment
    
    raw_id_fields = (
        "course",
        "term",
    )
    list_display = (
        "name",
        "course",
        "term",
        "is_active"
    )

    search_fields = (
        "name",
        "term__name",
        "course__subject__name"
    )

    list_filter = ("is_active", "course__school", "datetime")

    fieldsets = (
        (
            "Assignment information",
            {
                "fields": (
                    "course",
                    "term",
                    "name",
                    "description",
                    "datetime",
                    "is_active"
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
        )
    )
    
    base_read_only_fields = ["created_at", "updated_at"]