from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ...models import YearMark
from ....students.models import Student
from ...serializers import *
from ...permissions import *


class StudentYearMarksListAPI(generics.ListAPIView):
    serializer_class = YearMarkNestedSerializer
    queryset = YearMark.objects.select_related(*YearMark.related_fields)
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsUserItself],
            message="This view can be accessed only by: group teacher, school manager, student itself"
        )
    ]
    filterset_fields = ['enrollment__year']
    search_fields = ['enrollment__subject__name',]
    ordering_fields = ['updated_at', 'created_at', 'number']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_student())
    
    def get_student(self) -> Student:
        qs = Student.objects.select_related('user', 'group__teacher', 'group__grade', 'group__school')
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        return self.student
    
    def get_queryset(self):
        return self.queryset.filter(enrollment__student=self.student)