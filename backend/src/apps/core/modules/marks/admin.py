from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Mark

@admin.register(Mark)
class MarkAdmin(CustomModelAdmin):
    model = Mark
    
    raw_id_fields = ('assignment', 'enrollment')
    
    list_display = (
        "__str__",
        "assignment",
    )

    search_fields = ("assignment", "enrollment__student__user__email")

    list_filter = ("number",)

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "assignment",
                    "enrollment",
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
