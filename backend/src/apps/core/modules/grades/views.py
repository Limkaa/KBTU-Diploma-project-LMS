from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from .models import Grade
from ..schools.models import School
from . import serializers

from ..permissions import *

from apps.core.utils.pagination import OptionalPaginationListAPIView


class GradeCreateAPI(generics.CreateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = serializers.GradeModelSerializer
            
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)


class GradeRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.GradeModelSerializer
    queryset = Grade.objects.all()
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool, IsManager]
        
        if  self.request.method in SAFE_METHODS:
            self.permission_classes = [OnlyOwnSchool]
        
        return super().get_permissions()
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolGradesListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = serializers.GradeModelSerializer
    filterset_fields = ['is_active']
    ordering = ['created_at', 'updated_at']
    search_fields = ['name']
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Grade.objects.filter(school = school)
  