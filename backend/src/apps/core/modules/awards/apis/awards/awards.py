from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import School
from ...serializers import AwardModelSerializer
from ...services import AwardService


class SchoolAwardsListCreateAPI(
    generics.ListCreateAPIView, 
    OptionalPaginationListAPIView
):
    serializer_class = AwardModelSerializer
    search_fields = ['name']
    filterset_fields = [
        'issued_by_course_teacher',
        'issued_by_group_teacher',
        'issued_by_manager',
        'is_active',
    ]
    ordering_fields = [
        'points', 
        'created_at', 
        'updated_at', 
        'is_active'
    ]
    
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
        return AwardService.get_awards_of_school(self.school)


class AwardDetailAPI(generics.RetrieveUpdateAPIView):
    serializer_class = AwardModelSerializer
    queryset = AwardService.queryset()
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == 'PUT':
            self.permission_classes = [OnlyOwnSchool, IsManager]
        return super().get_permissions()


__all__ = [
    'SchoolAwardsListCreateAPI',
    'AwardDetailAPI'
]