from rest_framework.generics import get_object_or_404
from rest_framework import generics

from ..models import Year, Term
from ...schools.models import School

from ..serializers import (
    TermModelCreateUpdateSerializer, 
    TermModelNestedSerializer,
    TermModelSerializer
)

from ... import permissions

from apps.core.utils.pagination import OptionalPaginationListAPIView


class TermCreateAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = TermModelCreateUpdateSerializer
    queryset = Term.objects.all()
    
    def perform_create(self, serializer):
        year = serializer.validated_data.get('year')
        self.check_object_permissions(self.request, year)
        return super().perform_create(serializer)
    

class TermRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Term.objects.all()
    serializer_class = TermModelCreateUpdateSerializer
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    
    def get_object(self):
        term: Term = get_object_or_404(Term, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, term.year)
        return term
    
    def perform_update(self, serializer):
        year = serializer.validated_data.get('year')
        self.check_object_permissions(self.request, year)
        return super().perform_update(serializer)


class AcademicYearTermsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = TermModelSerializer
    
    def get_queryset(self):
        year = get_object_or_404(Year, pk = self.kwargs['year_id'])
        self.check_object_permissions(self.request, year)
        return Term.objects.filter(year = year)