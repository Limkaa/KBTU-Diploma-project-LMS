from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import School, Timebound
from .serializers import *


class SchoolTimeboundsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = TimeboundModelSerializer
    ordering = ['from_time', 'to_time', 'created_at', 'updated_at']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, self.school)
        
    def get_permissions(self):
        method = self.request.method
        
        if method == "POST":
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool]

        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(school=self.school)
    
    def get_queryset(self):
        return Timebound.objects.filter(school=self.school)


class TimeboundRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TimeboundModelSerializer
    queryset = Timebound.objects.all()
    
    def get_object(self):
        timebound: Timebound = get_object_or_404(Timebound, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, timebound.school)
        return timebound
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool]

        return super().get_permissions()

