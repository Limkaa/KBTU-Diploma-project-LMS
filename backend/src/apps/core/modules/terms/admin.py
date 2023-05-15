from django.contrib import admin

from ...utils.admin import CustomModelAdmin

from .models import Year, Term

@admin.register(Year)
class YearAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "school",
        "is_active",
        "is_opened_to_marks"
    )

    search_fields = ("school", "name")

    list_filter = ("is_active", "school", "is_opened_to_marks")

    fieldsets = (
        (
            "Year information",
            {
                "fields": (
                    "school",
                    "name",
                    "is_active",
                    "is_opened_to_marks"
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
class TermAdmin(CustomModelAdmin):
    model = Term
    
    list_display = (
        "name",
        "year",
        "from_date",
        "to_date",
        "is_closed",
        "is_finished",
        "is_opened_to_final_marks"
    )

    search_fields = ("name", "year", "year__school__name")

    list_filter = (
        "is_closed",
        "year__school",
    )

    fieldsets = (
        (
            "Term information",
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
    
    base_read_only_fields = ["created_at", "updated_at"]