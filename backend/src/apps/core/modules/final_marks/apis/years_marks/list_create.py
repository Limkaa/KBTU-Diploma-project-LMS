from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ...models import YearMark
from ....courses.models import Course
from ...serializers import *
from ...permissions import *


class CourseYearMarkListCreateAPI(generics.ListCreateAPIView):
    serializer_class = YearMarkCreateSerializer
    queryset = YearMark.objects.select_related(*YearMark.related_fields)
    search_fields = [
        'enrollment__student__user__email',
        'enrollment__student__user__first_name',
        'enrollment__student__user__last_name',
    ]
    ordering_fields = [
        'updated_at',
        'created_at',
        'enrollment__student__user__first_name',
        'enrollment__student__user__last_name',
    ]
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self) -> Course:
        qs = Course.objects.select_related('teacher', 'group__teacher', 'group', 'school')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        return self.queryset.filter(
            enrollment__course=self.course,
            enrollment__student__group=self.course.group
        )
    
    def perform_create(self, serializer):
        return serializer.save(last_edited_by = self.request.user)

    def get_permissions(self):
        self.permission_classes = [
            OnlyOwnSchool,
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
                message="This view can be accessed only by: course teacher, school manager, group teacher"
            )
        ]
        if self.request.method == "POST":
            self.permission_classes = [
                OnlyOwnSchool,
                IsCourseTeacher
            ]
        return super().get_permissions()