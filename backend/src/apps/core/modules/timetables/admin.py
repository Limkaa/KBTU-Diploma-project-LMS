from django.contrib import admin
from django.contrib.admin import widgets
from django.contrib.admin.sites import site
from ...utils.admin import CustomModelAdmin

from .models import Room, Timebound, Timetable, Course, School


@admin.register(Room)
class RoomAdmin(CustomModelAdmin):
    model = Room
    
    raw_id_fields = (
        "school",
    )
    list_display = (
        "__str__",
        "school",
        "is_active"
    )
    
    list_filter = ("is_active", )

    search_fields = (
        "school__name",
        "name",
    )

    fieldsets = (
        (
            "Room information",
            {
                "fields": (
                    "school",
                    "name",
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


@admin.register(Timebound)
class TimeboundAdmin(CustomModelAdmin):
    model = Timebound
    
    raw_id_fields = (
        "school",
    )
    list_display = (
        "__str__",
        "school",
        "from_time",
        "to_time",
    )

    search_fields = (
        "school__name",
        "from_time",
        "to_time"
    )

    fieldsets = (
        (
            "Course post information",
            {
                "fields": (
                    "school",
                    "from_time",
                    "to_time",
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


@admin.register(Timetable)
class TimetableAdmin(CustomModelAdmin):
    model = Timetable
    
    raw_id_fields = (
        "school",
        "course",
        "room",
        "timebound"
    )
    
    list_display = (
        "__str__",
        "school",
        "weekday",
        "course"
    )

    search_fields = (
        "school__name",
        "room",
        "floor",
        "course__group__code"
        "course__teacher__email"
    )
    
    list_filter = ('weekday',)

    fieldsets = (
        (
            "Room information",
            {
                "fields": (
                    "school",
                    "course",
                    "room",
                    "timebound",
                    "weekday",
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
    
    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # form.fields['course'].queryset = Course.objects.filter(school=form.fields['school'])
        # form.fields['course'].widget = widgets.(rel=Timetable._meta.get_field('course').remote_field, admin_site=site)
        return form
