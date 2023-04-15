from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import CoursePost, CoursePostComment
from .serializers import *
from .permissions import *


class CoursePostCommentsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool, 
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsCourseStudent, IsCourseTeacher],
            message='This view can be accessed only by: course student or teacher'
        )
    ]
    serializer_class = CoursePostCommentModelSerializer
    ordering = 'created_at'
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.course_post = get_object_or_404(CoursePost, pk = self.kwargs['post_id'])
        self.check_object_permissions(self.request, self.course_post.course)
    
    def perform_create(self, serializer):
        return serializer.save(post=self.course_post, user=self.request.user)
    
    def get_queryset(self):
        return CoursePostComment.objects.filter(post=self.course_post).select_related('user')


class CoursePostCommentRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CoursePostCommentModelSerializer
    queryset = CoursePostComment.objects.all().select_related('user')
    
    def get_permissions(self):
        self.permissons = [
            IsCommentOfOwnSchool, 
            CustomOperandHolder(
                operand=CustomOR,
                permissions=[IsCommentOfCourseStudent, IsCommentOfCourseTeacher],
                message='This view can be accessed only by: course student or teacher'
            )
        ]
        
        if self.request.method not in SAFE_METHODS:
            self.permissons.append(IsUserItself)
        
        return super().get_permissions()

