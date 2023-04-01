from rest_framework.generics import get_object_or_404
from rest_framework import generics

from .models import Grade
from ..schools.models import School
from . import serializers

from .. import permissions


class GradeCreateAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.IsManager,
        permissions.OnlyOwnSchoolObject
    ]
    serializer_class = serializers.GradeModelSerializer
            
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)


class GradeRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsManager,
        permissions.OnlyOwnSchoolObject
    ]
    serializer_class = serializers.GradeModelSerializer
    queryset = Grade.objects.all()
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolGradesListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = serializers.GradeModelSerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Grade.objects.filter(school = school)
  