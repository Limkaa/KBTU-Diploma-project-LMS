from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Course, Syllabus

from .serializers import SyllabusModelSerializer


class SyllabusListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = SyllabusModelSerializer
    
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
                    message = "This action can be performed only by: school manager, course teacher or student", 
                    permissions = [IsManager, IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(course=self.course)
    
    def get_queryset(self):
        return Syllabus.objects.filter(course=self.course)


class SyllabusRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SyllabusModelSerializer
    queryset = Syllabus.objects.all()
    
    def get_object(self):
        syllabus = get_object_or_404(Syllabus, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, syllabus.course)
        return syllabus
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [OnlyOwnSchool, IsCourseTeacher]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: school manager, course teacher or student", 
                    permissions = [IsManager, IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()