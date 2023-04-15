from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import SchoolPost, SchoolPostComment 
from .serializers import *
from .permissions import *

class SchoolPostCommentsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = SchoolPostCommentModelSerializer
    ordering = 'created_at'
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school_post = get_object_or_404(SchoolPost, pk = self.kwargs['post_id'])
        self.check_object_permissions(self.request, self.school_post.school)
    
    def perform_create(self, serializer):
        return serializer.save(post=self.school_post, user=self.request.user)
    
    def get_queryset(self):
        return SchoolPostComment.objects.filter(post=self.school_post).select_related('user')


class SchoolPostCommentRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SchoolPostCommentModelSerializer
    queryset = SchoolPostComment.objects.all().select_related('user')
    permission_classes = [IsCommentOfOwnSchool, IsUserItself]
    
    def get_permissions(self):
        self.permission_classes = [IsCommentOfOwnSchool]
        
        if self.request.method not in SAFE_METHODS:
            self.permission_classes = [IsCommentOfOwnSchool, IsUserItself]
        
        return super().get_permissions()
