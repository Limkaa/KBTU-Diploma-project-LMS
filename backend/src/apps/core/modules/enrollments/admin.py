from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Enrollment


@admin.register(Enrollment)
class EnrollmentAdmin(CustomModelAdmin):
    model = Enrollment
    
    raw_id_fields = (
        "student",
        "subject",
        "year",
        "course",
    )
    list_display = (
        "student",
        "subject",
        "year",
    )
    search_fields = (
        "student__user__email",
        "subject__name",
        "year__name"
    )

    fieldsets = (
        (
            "Enrollment information",
            {
                "fields": (
                    "student",
                    "subject",
                    "year",
                    "course",
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
