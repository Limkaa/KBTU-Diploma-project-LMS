from django.db.models import Prefetch, Count

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import Community, School
from ...serializers import *


class SchoolCommunitiesListCreateAPI(generics.ListCreateAPIView):
    serializer_class = CommunityModelSerializer
    filterset_fields = ['is_active']
    ordering_fields = ['is_active', 'members_count', 'created_at', 'updated_at']
    search_fields = ['name']
    ordering = ['-is_active', '-created_at']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_school()
        
    def check_school(self):
        qs = School.objects.all()
        self.school = get_object_or_404(qs, pk=self.kwargs['school_id'])
        self.check_object_permissions(self.request, self.school)
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == "POST":
            self.permission_classes = [OnlyOwnSchool, IsManager]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(school=self.school)

    def get_queryset(self):
        qs = Community.objects.filter(school=self.school)
        qs = qs.prefetch_related('members')
        qs = qs.annotate(members_count=Count('members'))
        return qs


class CommunityDetailAPI(generics.RetrieveUpdateAPIView):
    serializer_class = CommunityModelSerializer
    queryset = Community.objects.select_related('school')
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == 'PUT':
            self.permission_classes = [OnlyOwnSchool, IsManager]
        return super().get_permissions()


__all__ = [
    'SchoolCommunitiesListCreateAPI',
    'CommunityDetailAPI'
]