from django.contrib import admin

from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "group",
    )

    search_fields = ("user__email", "group__code")

    list_filter = ("group",)

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "user",
                    "group",
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
