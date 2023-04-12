from rest_framework.generics import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import SAFE_METHODS

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import Year, Term, School

from ..serializers import (
    TermModelCreateUpdateSerializer, 
    TermModelNestedSerializer,
    TermModelSerializer
)


class TermCreateAPI(generics.CreateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = TermModelCreateUpdateSerializer
    queryset = Term.objects.all()
    
    def perform_create(self, serializer):
        year = serializer.validated_data.get('year')
        self.check_object_permissions(self.request, year)
        return super().perform_create(serializer)
    

class TermRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Term.objects.all()
    serializer_class = TermModelCreateUpdateSerializer
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool, IsManager]
        
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [OnlyOwnSchool]
        
        return super().get_permissions()
    
    def get_object(self):
        term: Term = get_object_or_404(Term, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, term.year)
        return term
    
    def perform_update(self, serializer):
        year = serializer.validated_data.get('year')
        self.check_object_permissions(self.request, year)
        return super().perform_update(serializer)


class AcademicYearTermsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool]
    serializer_class = TermModelSerializer
    filterset_fields = ['is_closed']
    ordering_fields = ['created_at', 'updated_at', 'from_date', 'to_date']
    search_fields = ['name']
    
    def get_queryset(self):
        year = get_object_or_404(Year, pk = self.kwargs['year_id'])
        self.check_object_permissions(self.request, year)
        return Term.objects.filter(year = year)