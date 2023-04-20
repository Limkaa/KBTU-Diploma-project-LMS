from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Mark

@admin.register(Mark)
class MarkAdmin(CustomModelAdmin):
    model = Mark
    
    raw_id_fields = ('assignment', 'student')
    
    list_display = (
        "__str__",
        "assignment",
    )

    search_fields = ("assignment", "student__user__email")

    list_filter = ("number",)

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "assignment",
                    "student",
                    "number",
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
        ),
    )
    
    base_read_only_fields = ["created_at", "updated_at"]
