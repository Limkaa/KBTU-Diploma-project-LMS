from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import Year, School

from ..serializers import YearModelSerializer


class YearCreateAPI(generics.CreateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = YearModelSerializer
    queryset = Year.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class YearRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearModelSerializer

    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool, IsManager]
        
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [OnlyOwnSchool]
        
        return super().get_permissions()
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolYearsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = YearModelSerializer
    filterset_fields = ['is_active']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['name']
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Year.objects.filter(school = school)