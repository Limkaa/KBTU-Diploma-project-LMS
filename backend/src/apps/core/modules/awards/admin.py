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
    )

    fieldsets = (
        (
            "Award information",
            {
                "fields": (
                    "school",
                    "name",
                    "description",
                    "points",
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


@admin.register(Winner)
class WinnerAdmin(CustomModelAdmin):
    model = Winner
    
    raw_id_fields = (
        "student",
        "award",
        "issued_by",
        "course",
    )
    list_display = (
        "student",
        "award",
    )
    search_fields = (
        "student__user__email",
        "student__user__school__name",
        "award__name",
    )

    fieldsets = (
        (
            "Winner information",
            {
                "fields": (
                    "student",
                    "award",
                    "issued_by",
                    "course",
                    "comment",
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