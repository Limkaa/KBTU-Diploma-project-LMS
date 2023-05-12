from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ...models import TermMark
from ...serializers import *
from ...permissions import *


class TermMarkDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TermMarkUpdateSerializer
    queryset = TermMark.objects.select_related(*TermMark.related_fields)
    
    def perform_destroy(self, instance):
        return super().perform_destroy(instance)
    
    def perform_update(self, serializer):
        return serializer.save(last_edited_by = self.request.user)
    
    def get_permissions(self):
        self.permission_classes = [
            IsMarkOfOwnSchool,
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[
                    IsManager,
                    IsTeacherOfEnrollmentStudentGroup,
                    IsTeacherOfEnrollmentCourse,
                    IsRelatedStudent
                ],
                message="This view can be accessed only by: school manager, group teacher, current course teacher or student"
            )
        ]
        if self.request.method in ["DELETE", "PUT"]:
            self.permission_classes = [
                IsMarkOfOwnSchool,
                IsTeacherOfEnrollmentCourse,
                TermIsOpenedToFinalMarks
            ]
        return super().get_permissions()
    

__all__ = [
    'TermMarkDetailAPI'
]