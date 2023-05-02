from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ..models import Enrollment, Course
from ..serializers import *
from ...permissions import *


class EnrollmentDetailAPI(generics.RetrieveUpdateAPIView):
    serializer_class = EnrollmentModelUpdateSerializer
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_object_permissions(request, self.get_course())
    
    def get_course(self):
        qs = Course.objects.select_related('school', 'teacher', 'group__teacher')
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        return self.course
    
    def get_queryset(self):
        return Enrollment.objects.filter(
            student__group=self.course.group,
            subject=self.course.subject,
            year=self.course.year
        ).select_related(*Enrollment.related_fields)
    
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
        return obj
    
    def perform_update(self, serializer):
        return serializer.save(course=self.course)
    
    def get_permissions(self):
        self.permission_classes = [
            OnlyOwnSchool,
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[IsManager, IsGroupTeacher, IsCourseTeacher],
                message="This view can be accessed only by: school manager, group teacher, course teacher"
            )
        ]
        if self.request.method == "PUT":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand=CustomOR,
                    permissions=[IsManager, IsCourseTeacher],
                    message="This view can be accessed only by: school manager, course teacher"
                )
            ]
        return super().get_permissions()
