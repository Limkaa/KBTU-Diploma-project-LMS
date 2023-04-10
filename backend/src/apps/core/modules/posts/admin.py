from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import CoursePost, SchoolPost


@admin.register(CoursePost)
class CoursePostAdmin(CustomModelAdmin):
    model = CoursePost
    
    raw_id_fields = (
        "course",
    )
    list_display = (
        "title",
        "course",
    )

    search_fields = (
        "title",
        "course__subject__name"
    )

    list_filter = ("created_at", "updated_at")

    fieldsets = (
        (
            "Course post information",
            {
                "fields": (
                    "course",
                    "title",
                    "text",
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


@admin.register(SchoolPost)
class SchoolPostAdmin(CustomModelAdmin):
    model = SchoolPost
    
    raw_id_fields = (
        "school",
    )
    list_display = (
        "title",
        "school",
    )

    search_fields = (
        "title",
        "school__name"
    )

    list_filter = ("school", "created_at", "updated_at")

    fieldsets = (
        (
            "Course post information",
            {
                "fields": (
                    "school",
                    "title",
                    "text",
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