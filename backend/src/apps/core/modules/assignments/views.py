from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from ..users.models import User

from .models import Course, Assignment
from ..students.models import Student
from ..enrollments.models import Enrollment
from .serializers import *


class CourseAssignmentsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = CreateAssignmentSerializer
    filterset_fields = ['term', 'is_active']
    ordering = ['datetime']
    search_fields = ['name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.course = get_object_or_404(Course, pk = self.kwargs['course_id'])
        self.check_object_permissions(self.request, self.course)
        
    def get_permissions(self):
        method = self.request.method
        
        if method == "POST":
            self.permission_classes = [OnlyOwnSchool, IsCourseTeacher]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: course teacher or student", 
                    permissions = [IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(course=self.course)
    
    def get_queryset(self):
        return Assignment.objects.filter(course=self.course).select_related('term', 'course')


class AssignmentRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UpdateAssignmentSerializer
    queryset = Assignment.objects.all().select_related('term', 'course')
    
    def get_object(self):
        assignment = get_object_or_404(Assignment, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, assignment.course)
        return assignment
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [OnlyOwnSchool, IsCourseTeacher]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: course teacher or student", 
                    permissions = [IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()


class TeacherAllAssignmentsListAPI(OptionalPaginationListAPIView):
    serializer_class = AssignmentModelNestedSerializer
    permission_classes = [OnlyOwnSchool, IsTeacher, IsUserItself]
    queryset = Assignment.objects.select_related('course', 'term', 'course__school')
    filterset_fields = ['course', 'term', 'is_active', 'course__subject', 'course__year', 'course__group']
    ordering = ['datetime']
    search_fields = ['name']
    
    def get_queryset(self):
        teacher = get_object_or_404(User.objects.select_related('school'), pk=self.kwargs['teacher_id'], role=User.Role.TEACHER)
        self.check_object_permissions(self.request, teacher)
        return self.queryset.filter(course__teacher=teacher)


class StudentAllAssignmentsListAPI(OptionalPaginationListAPIView):
    serializer_class = AssignmentModelNestedSerializer
    permission_classes = [OnlyOwnSchool, IsStudent, IsUserItself]
    queryset = Assignment.objects.select_related('course', 'term', 'course__school')
    filterset_fields = ['course', 'term', 'is_active', 'course__subject', 'course__year']
    ordering = ['datetime', 'created_at', 'updated_at']
    search_fields = ['name']
    ordering = '-created_at'
    
    def get_queryset(self):
        student = get_object_or_404(Student.objects.select_related('user', 'group', 'group__school'), pk=self.kwargs['student_id'])
        self.check_object_permissions(self.request, student)
        student_enrollments = Enrollment.objects.filter(
            student=student, course__group=student.group).values_list('course', flat=True)
        return self.queryset.filter(course__in=student_enrollments)