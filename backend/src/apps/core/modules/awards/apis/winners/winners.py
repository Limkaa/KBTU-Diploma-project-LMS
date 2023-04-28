from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import School, Student, Course, Group, Award, Winner
from ....users.models import User
from ... import serializers


class WinnerDetailAPI(generics.RetrieveAPIView):
    serializer_class = serializers.WinnerNestedSerializer
    queryset = Winner.objects.select_related(*Winner.related_fields)
    permission_classes = [OnlyOwnSchool]

    def check_object_permissions(self, request, obj):
        return super().check_object_permissions(request, obj.student.group)


class AwardWinnersListAPI(generics.ListAPIView):
    serializer_class = serializers.WinnerNestedSerializer
    permission_classes = [OnlyOwnSchool]
    filterset_fields = ['student__user__gender']
    ordering_fields = ['created_at']

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        query = Award.objects.select_related(*Award.related_fields)
        self.award = get_object_or_404(query, pk=self.kwargs['award_id'])
        self.check_object_permissions(request, self.award)

    def get_queryset(self):
        return Winner.objects.of_award(self.award).select_related(*Winner.related_fields)


class SchoolWinnersListAPI(generics.ListAPIView):
    serializer_class = serializers.WinnerNestedSerializer
    permission_classes = [OnlyOwnSchool]
    filterset_fields = ['student__user__gender']
    ordering_fields = ['created_at']

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(
            School.objects.all(), pk=self.kwargs['school_id'])
        self.check_object_permissions(request, self.school)

    def get_queryset(self):
        return Winner.objects.of_school(self.school).select_related(*Winner.related_fields)


class StudentAwardsListAPI(generics.ListAPIView):
    class OutputSerializer(serializers.WinnerNestedSerializer):
        student = None
        
    serializer_class = OutputSerializer
    permission_classes = [OnlyOwnSchool]
    filterset_fields = ['award']
    ordering_fields = ['created_at']

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        qs = Student.objects.all()
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        self.check_object_permissions(request, self.student)

    def get_queryset(self):
        return Winner.objects.of_student(self.student).select_related(*Winner.related_fields)


class IssuedWinnersListAPI(generics.ListAPIView):
    serializer_class = serializers.WinnerNestedSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsTeacher],
            message='This view can be accessed only by: school manager or teacher'
        )
    ]
    filterset_fields = ['student__user__gender']
    ordering_fields = ['created_at']

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.user = get_object_or_404(User.objects.all(), pk=self.kwargs['user_id'])
        self.check_object_permissions(request, self.user)

    def get_queryset(self):
        qs = Winner.objects.issued_by(self.user).select_related(*Winner.related_fields)
        return qs


class CourseWinnersListCreatAPI(generics.ListCreateAPIView):
    serializer_class = serializers.WinnerCreateSerializer
    filterset_fields = ['student__user__gender']
    ordering_fields = ['created_at']
    ordering = '-created_at'

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.course = get_object_or_404(
            Course.objects.all().select_related('teacher', 'group__teacher', 'group', 'school', 'group__school'), pk=self.kwargs['course_id'])
        self.check_object_permissions(request, self.course)
        
    def get_permissions(self):
        self.permission_classes = [
            OnlyOwnSchool,
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[IsManager, IsGroupTeacher, IsCourseStudent, IsCourseTeacher],
                message='This view can be accessed only by: school manager, group teacher, course teacher or student'
            )
        ]
        if self.request.method == 'POST':
            self.permission_classes = [OnlyOwnSchool, IsCourseTeacher]
        return super().get_permissions()

    def perform_create(self, serializer):
        return serializer.save(
            course=self.course,
            issued_by=self.request.user
        )

    def get_queryset(self):
        return Winner.objects.of_course(self.course).select_related(*Winner.related_fields)



__all__ = [
    'WinnerDetailAPI',
    'AwardWinnersListAPI',
    'SchoolWinnersListAPI',
    'StudentAwardsListAPI',
    'IssuedWinnersListAPI',
    'CourseWinnersListCreatAPI'
]
