from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Todo


@admin.register(Todo)
class TodoAdmin(CustomModelAdmin):
    model = Todo
    
    raw_id_fields = (
        "user",
    )
    list_display = (
        "user",
        "name",
        "is_done",
        "priority"
    )
    search_fields = (
        "user__first_name",
        "user__last_name",
        "user__email",
        "name",
    )

    list_filter = (
        "is_done",
        "priority"
    )

    fieldsets = (
        (
            "Todo information",
            {
                "fields": (
                    "user",
                    "name",
                    "description",
                    "is_done",
                    "priority"
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