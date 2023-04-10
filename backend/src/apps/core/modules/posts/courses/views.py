from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import CoursePost, Course
from .serializers import *


class CoursePostsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = CoursePostModelSerializer
    ordering = ['created_at', 'updated_at']
    search_fields = ['title']
    
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
        return CoursePost.objects.filter(course=self.course)


class CoursePostRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CoursePostModelSerializer
    queryset = CoursePost.objects.all()
    
    def get_object(self):
        post: CoursePost = get_object_or_404(CoursePost, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, post.course)
        return post
    
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

