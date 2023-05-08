from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...students.serializers import StudentModelNestedSerializer

from ..models import Enrollment, Course
from ..serializers import *
from ...permissions import *

from .. import selectors


class NotEnrolledStudentListAPI(OptionalPaginationListAPIView):
    serializer_class = StudentModelNestedSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
            message="This view can be accessed only by: school manager, group teacher, course teacher"
        )
    ]
    filterset_fields = ['user__gender']
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
    ]
    ordering_fields = [
        'created_at',
        'updated_at',
        'user__gender',
        'user__email',
        'user__first_name',
        'user__last_name',
    ]
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self):
        qs = Course.objects.select_related('school', 'teacher', 'group__teacher')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        qs = selectors.get_not_enrolled_students(self.course)
        return qs.select_related('group', 'group__teacher', 'group__grade', 'user')


class TransferredEnrollmentsListAPI(OptionalPaginationListAPIView):
    serializer_class = EnrollmentNestedSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
            message="This view can be accessed only by: school manager, group teacher, course teacher"
        )
    ]
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
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self):
        qs = Course.objects.select_related('school', 'teacher', 'group__teacher')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        qs = selectors.get_transferred_enrollments(self.course)
        return qs.select_related(*Enrollment.related_fields)