from django.contrib import admin

from .models import Year

@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "school",
        "is_active"
    )

    search_fields = ("school", "name")

    list_filter = ("is_active", "school")

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "school",
                    "name",
                    "is_active",
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
    
    readonly_fields = ["created_at", "updated_at"]
