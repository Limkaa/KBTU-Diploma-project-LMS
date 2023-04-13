from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Course, School, User, Subject, Year, Group
from .filters import *

from .serializers import (
    CourseModelNestedSerializer,
    CreateCourseSerializer,
    UpdateCourseSerializer
)

from ..students.serializers import StudentModelNestedSerializer

class CourseRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Course.objects.all().select_related('teacher', 'school', 'subject', 'group', 'year')
    
    def get_permissions(self):
        method = self.request.method
        
        if method == "PUT":
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: school manager, course group superviser, course teacher or student", 
                    permissions = [IsManager, IsCourseTeacher, IsCourseStudent, IsGroupTeacher]
                )
            ]

        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return UpdateCourseSerializer
        return CourseModelNestedSerializer


class SchoolCoursesListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    filterset_class = CoursesFilterSet
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['teacher__first_name', 'teacher__last_name', 'teacher__email', 'group__code', 'subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, self.school)
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCourseSerializer
        return CourseModelNestedSerializer
    
    def perform_create(self, serializer):
        return serializer.save(school=self.school)
    
    def get_queryset(self):
        return Course.objects.filter(school = self.school).select_related('teacher', 'school', 'subject', 'group', 'year')


class TeacherCoursesListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand = CustomOR, 
            message = "This action can be performed only by: school manager, teacher itself", 
            permissions = [IsManager, IsUserItself]
        )
    ]
    serializer_class = CourseModelNestedSerializer
    filterset_class = CoursesFilterSet
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['group__code', 'subject__name']
    
    
    def get_queryset(self):
        teacher = get_object_or_404(User, pk = self.kwargs['teacher_id'], role=User.Role.TEACHER)
        self.check_object_permissions(self.request, teacher)
        return Course.objects.filter(teacher = teacher).select_related('teacher', 'school', 'subject', 'group', 'year')


class SubjectCoursesListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        IsManager
    ]
    serializer_class = CourseModelNestedSerializer
    filterset_class = CoursesFilterSet
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['teacher__first_name', 'teacher__last_name', 'teacher__email', 'group__code']
    
    
    def get_queryset(self):
        subject = get_object_or_404(Subject, pk = self.kwargs['subject_id'])
        self.check_object_permissions(self.request, subject)
        return Course.objects.filter(subject = subject).select_related('teacher', 'school', 'subject', 'group', 'year')


class YearCoursesListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        IsManager
    ]
    serializer_class = CourseModelNestedSerializer
    filterset_class = CoursesFilterSet
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['teacher__first_name', 'teacher__last_name', 'teacher__email', 'group__code']
    
    
    def get_queryset(self):
        year = get_object_or_404(Year, pk = self.kwargs['year_id'])
        self.check_object_permissions(self.request, year)
        return Course.objects.filter(year = year).select_related('teacher', 'school', 'subject', 'group', 'year')


class GroupCoursesListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand = CustomOR, 
            message = "This action can be performed only by: school manager, group superviser or student", 
            permissions = [IsManager, IsGroupTeacher, IsGroupStudent]
        )
    ]
    serializer_class = CourseModelNestedSerializer
    filterset_class = CoursesFilterSet
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['teacher__first_name', 'teacher__last_name', 'teacher__email', 'subject__name']
    
    
    def get_queryset(self):
        group = get_object_or_404(Group, pk = self.kwargs['group_id'])
        self.check_object_permissions(self.request, group)
        return Course.objects.filter(group = group).select_related('teacher', 'school', 'subject', 'group', 'year')


class CourseGroupStudentsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand = CustomOR,
            message = "This view can be accessed only by manager or course teacher",
            permissions = [IsManager, IsCourseTeacher]
        ) 
    ]
    filterset_fields = ['user__gender']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    
    class OutputSerializer(StudentModelNestedSerializer):
        group = None
    
    serializer_class = OutputSerializer
    
    def get_queryset(self):
        course = get_object_or_404(Course, pk = self.kwargs['course_id'])
        self.check_object_permissions(self.request, course)
        return course.group.students.select_related('group', 'user')