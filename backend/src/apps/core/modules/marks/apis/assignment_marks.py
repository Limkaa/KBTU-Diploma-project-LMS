from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ..models import Mark, Assignment
from ..serializers import *
from ..permissions import *


class AssignmentMarksListCreateAPI(generics.ListCreateAPIView):
    serializer_class = MarkCreateModelSerializer
    queryset = Mark.objects.select_related(*Mark.related_fields)
    permission_classes = [OnlyOwnSchool, IsCourseTeacher]
    filterset_fields = ['number']
    search_fields = [
        'enrollment__student__user__email',
        'enrollment__student__user__first_name',
        'enrollment__student__user__last_name',
    ]
    ordering_fields = [
        'updated_at',
        'created_at',
        'enrollment__student__user__first_name',
        'enrollment__student__user__last_name',
    ]
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_assignment().course)
    
    def get_assignment(self) -> Assignment:
        qs = Assignment.objects.select_related('course', 'course__teacher', 'course__school')
        self.assignment = get_object_or_404(qs, pk=self.kwargs['assignment_id'])
        return self.assignment
    
    def get_queryset(self):
        return self.queryset.filter(
            assignment=self.assignment,
            enrollment__course=self.assignment.course,
        )
    
    def perform_create(self, serializer):
        return serializer.save(
            assignment = self.assignment,
            last_edited_by = self.request.user
        )