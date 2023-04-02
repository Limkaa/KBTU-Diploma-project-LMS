from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ..models import Year
from ...schools.models import School

from ..serializers import YearModelSerializer

from ... import permissions

from apps.core.utils.pagination import OptionalPaginationListAPIView


class YearCreateAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = YearModelSerializer
    queryset = Year.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class YearRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Year.objects.all()
    serializer_class = YearModelSerializer
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolYearsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = YearModelSerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Year.objects.filter(school = school)