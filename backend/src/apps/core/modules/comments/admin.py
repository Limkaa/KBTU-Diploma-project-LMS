from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import CoursePostComment, SchoolPostComment


@admin.register(CoursePostComment)
class CoursePostCommentAdmin(CustomModelAdmin):
    model = CoursePostComment
    
    raw_id_fields = (
        "post",
    )
    list_display = (
        "text",
        "user"
    )

    search_fields = (
        "post__title",
    )

    fieldsets = (
        (
            "Course post comment information",
            {
                "fields": (
                    "post",
                    "user",
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


@admin.register(SchoolPostComment)
class SchoolPostCommentAdmin(CustomModelAdmin):
    model = SchoolPostComment
    
    raw_id_fields = (
        "post",
    )
    list_display = (
        "text",
        "user"
    )

    search_fields = (
        "post__title",
    )

    fieldsets = (
        (
            "School post comment information",
            {
                "fields": (
                    "post",
                    "user",
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