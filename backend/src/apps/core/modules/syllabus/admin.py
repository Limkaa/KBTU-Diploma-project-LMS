from django.contrib import admin

from .models import Syllabus


@admin.register(Syllabus)
class SyllabusAdmin(admin.ModelAdmin):
    
    raw_id_fields = (
        "course",
    )
    list_display = (
        "course",
        "name",
        "hours",
        "is_completed"
    )

    search_fields = (
        "course__subject__name",
        "course__group__code", 
        "name",
    )

    list_filter = ("is_completed",)

    fieldsets = (
        (
            "Syllabus point information",
            {
                "fields": (
                    "course",
                    "name",
                    "description",
                    "hours",
                    "is_completed"
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

    def get_readonly_fields(self, request, obj=None):
        base_fields = ["created_at", "updated_at"]
        if obj is None:
            return base_fields
        base_fields.extend(Syllabus.non_updatable_fields)
        return base_fields
