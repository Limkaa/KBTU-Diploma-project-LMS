from django.db.models import Prefetch

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import School, Award
from ...serializers import *


class SchoolAwardsListCreateAPI(
    generics.ListCreateAPIView, 
    OptionalPaginationListAPIView
):
    serializer_class = AwardWithStatsSerializer
    search_fields = ['name']
    filterset_fields = ['is_active']
    ordering_fields = ['points', 'created_at', 'updated_at', 'is_active']
    
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
        return Award.objects.of_school(self.school).select_related(*Award.related_fields)


class AwardDetailAPI(generics.RetrieveUpdateAPIView):
    serializer_class = AwardModelSerializer
    queryset = Award.objects.select_related(*Award.related_fields)
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == 'PUT':
            self.permission_classes = [OnlyOwnSchool, IsManager]
        return super().get_permissions()


__all__ = [
    'SchoolAwardsListCreateAPI',
    'AwardDetailAPI'
]