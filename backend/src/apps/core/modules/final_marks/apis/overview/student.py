from django.db.models import Prefetch, Subquery, OuterRef, F, Q, Avg

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ...models import TermMark, Enrollment
from ....students.models import Student
from ...serializers import *
from ...permissions import *


class StudentFinalMarksOverviewAPI(generics.ListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsUserItself],
            message="This view can be accessed only by: course teacher, school manager, group teacher"
        )
    ]
    serializer_class = EnrollmentFinalMarksSerializer
    filterset_fields = ['year']
    search_fields = ['subject__name']
    ordering_fields = ['terms_average']
    queryset = Enrollment.objects.select_related(*Enrollment.related_fields)
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_student())
    
    def get_student(self) -> Student:
        qs = Student.objects.select_related('user', 'group__teacher', 'group__grade', 'group__school', 'user__school')
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        return self.student
    
    def get_queryset(self):
        qs = self.queryset.filter(student=self.student)
        
        terms_marks_prefetch = TermMark.objects.filter(enrollment__student=self.student).select_related(*TermMark.related_fields)

        qs = qs.prefetch_related(Prefetch('terms_marks', terms_marks_prefetch))
        qs = qs.select_related('yearmark')
        qs = qs.annotate(terms_average=Avg('terms_marks__number'))
        
        return qs