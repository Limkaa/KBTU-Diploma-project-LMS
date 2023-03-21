from django.contrib import admin

from .models import Grade

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = (
        "school",
        "name",
        "is_active"
    )

    search_fields = ("school", "name")

    list_filter = ("is_active",)

    fieldsets = (
        (
            "Grade information",
            {
                "fields": (
                    "school",
                    "name",
                    "is_active",
                )
            },
        ),
    )
    
    readonly_fields = ["created_at", "updated_at"]
