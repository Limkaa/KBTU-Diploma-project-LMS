from rest_framework import generics

from .models import Grade
from . import serializers

from .. import permissions


class GradeListCreateAPI(generics.ListCreateAPIView):
    permission_classes = [
        permissions.IsManager,
        permissions.OnlyOwnSchool
    ]
    serializer_class = serializers.GradeSerializer
    
    def get_queryset(self):
        return Grade.objects.filter(school=self.kwargs["school_id"])
            
    def perform_create(self, serializer):
        serializer.save(school_id=self.kwargs["school_id"])


class GradeRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsManager,
        permissions.OnlyOwnSchoolObject
    ]
    serializer_class = serializers.GradeSerializer
    queryset = Grade.objects.all()