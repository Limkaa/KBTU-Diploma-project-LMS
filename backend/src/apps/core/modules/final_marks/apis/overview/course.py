from django.db.models import Prefetch, Subquery, OuterRef, F, Q, Avg

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ...models import TermMark, YearMark, Enrollment
from ....courses.models import Course
from ...serializers import *
from ...permissions import *


class CourseFinalMarksOverviewAPI(generics.ListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
            message="This view can be accessed only by: course teacher, school manager, group teacher"
        )
    ]
    serializer_class = EnrollmentFinalMarksSerializer
    search_fields = [
        'student__user__email',
        'student__user__first_name',
        'student__user__last_name',
    ]
    ordering_fields = [
        'terms_average',
        'student__user__first_name',
        'student__user__last_name',
    ]
    queryset = Enrollment.objects.select_related(*Enrollment.related_fields)
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self) -> Course:
        qs = Course.objects.select_related('teacher', 'group__teacher', 'group', 'school')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        qs = self.queryset.filter(
            student__group=self.course.group,
            course=self.course
        )
        
        terms_marks_prefetch = TermMark.objects.filter(enrollment__course=self.course).select_related(*TermMark.related_fields)

        qs = qs.prefetch_related(Prefetch('terms_marks', terms_marks_prefetch))
        qs = qs.select_related('yearmark')
        qs = qs.annotate(terms_average=Avg('terms_marks__number'))
        
        return qs
