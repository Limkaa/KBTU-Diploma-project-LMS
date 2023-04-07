from django.contrib import admin

from .models import Course, User


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    
    raw_id_fields = (
        "teacher",
        "group",
        "year",
        "subject"
    )
    list_display = (
        "subject",
        "school",
        "teacher",
        "year",
        "group",
        "is_active"
    )

    search_fields = (
        "school__name",
        "subject__name", 
        "teacher__email",
        "group__code",
        "year__name"
    )

    list_filter = ("is_active", "school")

    fieldsets = (
        (
            "Course information",
            {
                "fields": (
                    "school",
                    "subject",
                    "year",
                    "teacher",
                    "group",
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
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        teacher_queryset = User.objects.filter(role=User.Role.TEACHER)
        if obj is not None:
            teacher_queryset = teacher_queryset.filter(school=obj.school)
        form.base_fields["teacher"].queryset = teacher_queryset
        return form

    def get_readonly_fields(self, request, obj=None):
        base_fields = ["created_at", "updated_at"]
        if obj is None:
            return base_fields
        base_fields.extend(Course.non_updatable_fields)
        return base_fields
