from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Subject, School, Grade

from .serializers import (
    SubjectModelCreateUpdateSerializer, 
    SubjectModelNestedSerializer
)


class SubjectCreateAPI(generics.CreateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = SubjectModelCreateUpdateSerializer
    queryset = Subject.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class SubjectRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Subject.objects.all().select_related('grade', 'school')
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool, IsManager]
        
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [OnlyOwnSchool]
        
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return SubjectModelCreateUpdateSerializer
        return SubjectModelNestedSerializer
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolSubjectsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = SubjectModelNestedSerializer
    filterset_fields = ['is_active']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['code', 'name']
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Subject.objects.filter(school = school).select_related('school', 'grade')
    

class GradeSubjectsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = SubjectModelNestedSerializer
    queryset = Subject.objects.all()
    filterset_fields = ['is_active']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['code', 'name']
    
    def get_queryset(self):
        grade = get_object_or_404(Grade, pk=self.kwargs['grade_id'])
        self.check_object_permissions(self.request, grade)
        return self.queryset.filter(grade=grade).select_related('school', 'grade')