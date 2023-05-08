from django.db.models import Prefetch, Avg, Count, Subquery, OuterRef, Q, F

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ....utils.pagination import OptionalPaginationListAPIView

from ..models import Mark, Enrollment, Student
from ..serializers import *
from ..permissions import *


class StudentMarksListAPI(generics.ListAPIView):
    serializer_class = MarkNestedSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[
                IsManager,
                IsGroupTeacher,
                IsUserItself
            ],
            message="This view can view can be accessed only by: school manager, group teacher, student itself"
        )
    ]
    queryset = Mark.objects.select_related(*Mark.related_fields)
    filterset_fields = ['number']
    search_fields = [
        'assignment__name',
        'assignment__course__subject__name'
    ]
    ordering_fields = [
        'updated_at',
        'created_at',
        'assignment__created_at',
        'assignment__datetime',
    ]
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_student())
    
    def get_student(self) -> Student:
        qs = Student.objects.select_related('user', 'group__teacher', 'group__grade', 'group__school')
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        return self.student
    
    def get_queryset(self):
        return self.queryset.filter(enrollment__student=self.student)


class StudentMarksGroupedByEnrollmentListAPI(generics.ListCreateAPIView):
    serializer_class = MarksGroupedByEnrollmentSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[
                IsManager,
                IsGroupTeacher,
                IsUserItself
            ],
            message="This view can view can be accessed only by: school manager, course teacher, group teacher"
        )
    ]
    queryset = Enrollment.objects.select_related(*Enrollment.related_fields)
    filterset_fields = ['year', 'subject__grade']
    search_fields = ['subject__name']
    ordering_fields = ['average_mark']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_student())
    
    def get_student(self) -> Student:
        qs = Student.objects.select_related('user', 'group__teacher', 'group__grade', 'group__school')
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        return self.student
    
    def get_queryset(self):
        qs = Enrollment.objects.filter(student=self.student)
        
        marks_prefetch = Mark.objects.filter(enrollment__student=self.student)
        term_kwarg = self.request.GET.get('term', None)
        term_filter = None
        if term_kwarg:
            term_filter = Q(marks__assignment__term=term_kwarg)
            marks_prefetch = marks_prefetch.filter(assignment__term=term_kwarg)
        
        qs = qs.prefetch_related(Prefetch('marks', marks_prefetch))
        qs = qs.annotate(average_mark=Avg('marks__number', filter=term_filter))
        
        return qs