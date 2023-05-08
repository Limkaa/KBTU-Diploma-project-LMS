from django.db.models import Prefetch, Avg, Count, Subquery, OuterRef, Q, F

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ....utils.pagination import OptionalPaginationListAPIView

from ..models import Mark, Enrollment
from ...courses.models import Course
from ..serializers import *
from ..permissions import *


class CourseMarksListAPI(generics.ListAPIView):
    serializer_class = MarkNestedSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[
                IsManager,
                IsCourseTeacher,
                IsGroupTeacher
            ],
            message="This view can view can be accessed only by: school manager, course teacher, group teacher"
        )
    ]
    queryset = Mark.objects.select_related(*Mark.related_fields)
    filterset_fields = [
        'number',
        'assignment__term'
    ]
    search_fields = [
        'assignment__name',
        'enrollment__student__user__email',
        'enrollment__student__user__first_name',
        'enrollment__student__user__last_name',
    ]
    ordering_fields = [
        'updated_at',
        'created_at',
        'assignment__created_at',
        'assignment__datetime',
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
            assignment__course=self.course,
            enrollment__course=self.course
        )


class CourseMarksGroupedByEnrollmentListAPI(OptionalPaginationListAPIView):
    serializer_class = MarksGroupedByEnrollmentSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[
                IsManager,
                IsCourseTeacher,
                IsGroupTeacher
            ],
            message="This view can view can be accessed only by: school manager, course teacher, group teacher"
        )
    ]
    queryset = Enrollment.objects.select_related(*Enrollment.related_fields)
    search_fields = [
        'student__user__email',
        'student__user__first_name',
        'student__user__last_name',
    ]
    ordering_fields = [
        'average_mark',
        'student__user__first_name',
        'student__user__last_name',
    ]
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self) -> Course:
        qs = Course.objects.select_related('teacher', 'group__teacher', 'group', 'school')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        qs = self.queryset.filter(course=self.course)
        
        marks_prefetch = Mark.objects.filter(enrollment__course=self.course).select_related(*Mark.related_fields)
        term_kwarg = self.request.GET.get('term', None)
        term_filter = None
        if term_kwarg:
            term_filter = Q(marks__assignment__term=term_kwarg)
            marks_prefetch = marks_prefetch.filter(assignment__term=term_kwarg)
        
        qs = qs.prefetch_related(Prefetch('marks', marks_prefetch))
        qs = qs.annotate(average_mark=Avg('marks__number', filter=term_filter))
        
        return qs