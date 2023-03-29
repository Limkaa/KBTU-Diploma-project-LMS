from rest_framework.generics import get_object_or_404
from rest_framework import generics

from .models import Subject
from ..schools.models import School
from ..grades.models import Grade

from .serializers import (
    SubjectModelCreateUpdateSerializer, 
    SubjectModelNestedSerializer
)

from .. import permissions


class SubjectCreateAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = SubjectModelCreateUpdateSerializer
    queryset = Subject.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class SubjectRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Subject.objects.all().select_related('grade', 'school')
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return SubjectModelCreateUpdateSerializer
        return SubjectModelNestedSerializer
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolSubjectsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = SubjectModelNestedSerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Subject.objects.filter(school = school).select_related('school', 'grade')
    

class GradeSubjectsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = SubjectModelNestedSerializer
    queryset = Subject.objects.all()
    
    def get_queryset(self):
        grade = get_object_or_404(Grade, pk=self.kwargs['grade_id'])
        self.check_object_permissions(self.request, grade)
        return self.queryset.filter(grade=grade).select_related('school', 'grade')