from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Subject, School, Grade

from .serializers import (
    SubjectModelCreateUpdateSerializer, 
    SubjectModelNestedSerializer
)


class SubjectCreateAPI(generics.CreateAPIView):
    permission_classes = [IsUserOfSchool, IsManager]
    serializer_class = SubjectModelCreateUpdateSerializer
    queryset = Subject.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class SubjectRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Subject.objects.all().select_related('grade', 'school')
    permission_classes = [IsUserOfSchool, IsManager]
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return SubjectModelCreateUpdateSerializer
        return SubjectModelNestedSerializer
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolSubjectsListAPI(OptionalPaginationListAPIView):
    permission_classes = [IsUserOfSchool, IsManager]
    serializer_class = SubjectModelNestedSerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Subject.objects.filter(school = school).select_related('school', 'grade')
    

class GradeSubjectsListAPI(OptionalPaginationListAPIView):
    permission_classes = [IsUserOfSchool, IsManager]
    serializer_class = SubjectModelNestedSerializer
    queryset = Subject.objects.all()
    
    def get_queryset(self):
        grade = get_object_or_404(Grade, pk=self.kwargs['grade_id'])
        self.check_object_permissions(self.request, grade)
        return self.queryset.filter(grade=grade).select_related('school', 'grade')