from django.contrib import admin
from django.utils.html import linebreaks
from ...utils.admin import CustomModelAdmin

from .models import Award, Winner


@admin.register(Award)
class AwardAdmin(CustomModelAdmin):
    model = Award
    
    raw_id_fields = (
        "school",
    )
    list_display = (
        "name",
        "school",
        "points",
        "is_active"
    )
    search_fields = (
        "school__name",
        "name",
    )

    list_filter = (
        "is_active",
        "issued_by_course_teacher",
        "issued_by_group_teacher",
        "issued_by_manager",
    )

    fieldsets = (
        (
            "Assignment information",
            {
                "fields": (
                    "school",
                    "name",
                    "description",
                    "points"
                    
                )
            },
        ),
        (
            "Switchable flags",
            {
                "fields": (
                    "issued_by_course_teacher",
                    "issued_by_group_teacher",
                    "issued_by_manager",
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