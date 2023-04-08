from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Course, Assignment
from .serializers import *


class CourseAssignmentsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = CreateAssignmentSerializer
    
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
                    message = "This action can be performed only by: course teacher or student", 
                    permissions = [IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(course=self.course)
    
    def get_queryset(self):
        return Assignment.objects.filter(course=self.course).select_related('term', 'course')


class AssignmentRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UpdateAssignmentSerializer
    queryset = Assignment.objects.all().select_related('term', 'course')
    
    def get_object(self):
        assignment = get_object_or_404(Assignment, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, assignment.course)
        return assignment
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [OnlyOwnSchool, IsCourseTeacher]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR, 
                    message = "This action can be performed only by: course teacher or student", 
                    permissions = [IsCourseTeacher, IsCourseStudent]
                )
            ]

        return super().get_permissions()

