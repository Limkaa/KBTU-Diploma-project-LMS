from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import TermMark, YearMark

@admin.register(TermMark)
class TermMarkAdmin(CustomModelAdmin):
    model = TermMark
    
    raw_id_fields = ('term', 'enrollment')
    
    list_display = (
        "__str__",
        "term",
    )

    search_fields = ("enrollment__student__user__email",)

    list_filter = ("number",)

    fieldsets = (
        (
            "Term Mark information",
            {
                "fields": (
                    "term",
                    "enrollment",
                    "number",
                    "last_edited_by"
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
    
    base_read_only_fields = ["created_at", "updated_at", "last_edited_by"]


@admin.register(YearMark)
class YearMarkAdmin(CustomModelAdmin):
    model = YearMark
    
    raw_id_fields = ('enrollment',)
    
    list_display = (
        "__str__",
    )

    search_fields = ("enrollment__student__user__email",)

    list_filter = ("number",)

    fieldsets = (
        (
            "Term Mark information",
            {
                "fields": (
                    "enrollment",
                    "number",
                    "last_edited_by"
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
    
    base_read_only_fields = ["created_at", "updated_at", "last_edited_by"]
