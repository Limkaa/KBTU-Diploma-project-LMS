from django.db.models import Prefetch, Avg, Q

from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.exceptions import NotFound

from apps.core.utils.pagination import OptionalPaginationListAPIView

from ..permissions import *
from .permissions import *

from .models import Mark, Assignment, Student
from ..courses.models import Course
from ..terms.models import Term

from .serializers import *
from .filters import AssignmentFilterSet


class AssignmentMarksListCreateAPI(generics.ListCreateAPIView, 
                                   OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsCourseTeacher]
    queryset = Mark.objects.all()
    search_fields = ['user__first_name', 'user__last_name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.assignment = get_object_or_404(
            Assignment.objects.all().select_related('course', 
                                                    'course__school', 
                                                    'course__teacher', 
                                                    'course__group'), 
            pk = self.kwargs['assignment_id']
        )
        self.check_object_permissions(self.request, self.assignment.course)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MarkCreateModelSerializer
        return StudentMarksSerializer
    
    def perform_create(self, serializer):
        return serializer.save(assignment=self.assignment)
    
    def get_queryset(self):
        return Student.objects.filter(group=self.assignment.course.group).prefetch_related(
            Prefetch('marks', queryset=Mark.objects.filter(assignment=self.assignment))).select_related('user')


class MarkRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MarkNestedSerializer
    queryset = Mark.objects.select_related(
        'assignment',
        'assignment__term',
        'student__user',
        'student__group',
        'student__group__grade',
        'assignment__course__school',
        'assignment__course__teacher'
    )
    
    def get_serializer_class(self):
        if self.request.method in ["DELETE", "PUT"]:
            return MarkModelSerializer
        return MarkNestedSerializer
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [IsMarkOfOwnSchool, IsTeacherOfMarkRelatedCourse]
        elif method == "GET":
            self.permission_classes = [
                IsMarkOfOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: course teacher or student itself", 
                    permissions = [IsTeacherOfMarkRelatedCourse, IsRelatedStudent]
                )
            ]

        return super().get_permissions()

    def get_object(self):
        mark = get_object_or_404(self.queryset, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, mark)
        return mark


class StudentAllMarksListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool, 
        CustomOperandHolder(
            operand = CustomOR, 
            message = "This action can be performed only by: student's group teacher or student itself", 
            permissions = [IsGroupTeacher, IsUserItself]
        )
    ]
    serializer_class = StudentAssignmentMarks
    filterset_class = AssignmentFilterSet
    ordering = ['datetime']
    search_fields = ['name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.student = get_object_or_404(Student.objects.select_related(
            'group',
            'group__teacher',
            'user',
        ), pk=self.kwargs['student_id'])
        self.check_object_permissions(request, self.student)
    
    def get_queryset(self):
        return Assignment.objects.filter(course__group=self.student.group).prefetch_related(
            Prefetch('marks', queryset=Mark.objects.filter(student=self.student))).select_related(
                'term',
                'course__teacher',
                'course__subject',
                'course__subject__grade',
                'course__year',
            )


class CourseAllMarksListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsCourseTeacher]
    serializer_class = StudentMarksOverviewSerializer
    ordering = ['average_mark']
    search_fields = ['user__last_name', 'user__first_name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.course = get_object_or_404(Course.objects.select_related(
            'group',
            'group__school',
            'year',
            'teacher',
        ), pk=self.kwargs['course_id'])
        self.check_object_permissions(request, self.course)
        self.check_term()
    
    def check_term(self):
        self.term = Term.objects.filter(pk=self.kwargs['term_id'], year=self.course.year).first()
        if self.term is None:
            raise NotFound('Term with this id does not exist or does not belong to course year')
    
    def get_queryset(self):
        return Student.objects.filter(group=self.course.group).prefetch_related(
            Prefetch('marks', queryset=Mark.objects.filter(assignment__course=self.course, assignment__term=self.term))
            ).select_related('user').annotate(average_mark=Avg('marks__number', filter=Q(marks__assignment__term=self.term)))
