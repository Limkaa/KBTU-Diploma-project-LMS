from django.contrib import admin

from .models import Year, Term

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


@admin.register(Term)
class TermAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "year",
        "from_date",
        "to_date",
        "is_closed"
    )

    search_fields = ("name", "year", "year__school__name")

    list_filter = ("is_closed", "year__school")

    fieldsets = (
        (
            "Group information",
            {
                "fields": (
                    "year",
                    "name",
                    "from_date",
                    "to_date",
                    "is_closed"
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