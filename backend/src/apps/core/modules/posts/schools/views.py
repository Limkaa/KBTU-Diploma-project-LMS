from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import SchoolPost, School
from .serializers import *


class SchoolPostsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = SchoolPostModelSerializer
    ordering = ['created_at', 'updated_at']
    search_fields = ['title']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, self.school)
        
    def get_permissions(self):
        method = self.request.method
        
        if method == "POST":
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool,]

        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(school=self.school)
    
    def get_queryset(self):
        return SchoolPost.objects.filter(school=self.school)


class SchoolPostRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SchoolPostModelSerializer
    queryset = SchoolPost.objects.all()
    
    def get_object(self):
        post: SchoolPost = get_object_or_404(SchoolPost, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, post.school)
        return post
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["PUT", "DELETE"]:
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool,]

        return super().get_permissions()

