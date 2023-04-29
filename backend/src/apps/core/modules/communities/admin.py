from django.contrib import admin
from ...utils.admin import CustomModelAdmin

from .models import Community, Membership


@admin.register(Community)
class CommunityAdmin(CustomModelAdmin):
    model = Community
    
    raw_id_fields = (
        "school",
    )
    list_display = (
        "school",
        "name",
        "is_active",
    )
    search_fields = (
        "school__name",
        "name",
    )

    list_filter = (
        "is_active",
    )

    fieldsets = (
        (
            "Community information",
            {
                "fields": (
                    "school",
                    "name",
                    "description",
                    "link",
                    "is_active"
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


@admin.register(Membership)
class MembershipAdmin(CustomModelAdmin):
    model = Membership
    
    raw_id_fields = (
        "community",
        "student"
    )
    list_display = (
        "student",
        "community",
        "created_at",
    )
    search_fields = (
        "student__user__email",
        "community__name",
        "community__school__name"
    )

    fieldsets = (
        (
            "Membership information",
            {
                "fields": (
                    "student",
                    "community",
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