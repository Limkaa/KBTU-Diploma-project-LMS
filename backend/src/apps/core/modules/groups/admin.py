from django.contrib import admin

from .models import Group

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = (
        "school",
        "id",
        "grade",
        "teacher",
        "code",
        "is_active"
    )

    search_fields = ("school", "grade", "code")

    list_filter = ("is_active", "school")

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "school",
                    "teacher",
                    "grade",
                    "code",
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
