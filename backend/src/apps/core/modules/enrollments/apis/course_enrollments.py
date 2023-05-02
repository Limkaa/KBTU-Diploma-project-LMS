from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView

from ..models import Enrollment, Course
from ..serializers import *
from ...permissions import *


class ListCreateAPI(
    OptionalPaginationListAPIView, 
    generics.CreateAPIView
    ):
    serializer_class = EnrollmentModelCreateSerializer
    filterset_fields = ['student__user__gender']
    search_fields = [
        'student__user__email',
        'student__user__first_name',
        'student__user__last_name',
    ]
    ordering_fields = [
        'created_at',
        'updated_at',
        'student__user__gender',
        'student__user__email',
        'student__user__first_name',
        'student__user__last_name',
    ]
    ordering = 'student__user__last_name'
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self):
        qs = Course.objects.select_related('school', 'teacher', 'group__teacher')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        qs =  Enrollment.objects.filter(course=self.course)
        return qs.select_related(*Enrollment.related_fields)
    
    def perform_create(self, serializer):
        return serializer.save(
            course=self.course,
            subject=self.course.subject,
            year=self.course.year
        )
    
    def get_permissions(self):
        self.permission_classes = [
            OnlyOwnSchool,
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
                message="This view can be accessed only by: school manager, group teacher, course teacher"
            )
        ]
        if self.request.method == "POST":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand=CustomOR,
                    permissions=[IsManager, IsCourseTeacher],
                    message="This view can be accessed only by: school manager, course teacher"
                )
            ]
        return super().get_permissions()
