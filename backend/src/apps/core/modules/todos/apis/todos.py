from django.db.models import Prefetch

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import Todo
from ..serializers import *


class TodoListCreateAPI(generics.ListCreateAPIView):
    serializer_class = TodoModelSerializer
    permission_classes = [IsUserItself]
    queryset = Todo.objects.all()
    filterset_fields = ['priority', 'is_done']
    ordering_fields = ['priority', 'is_done', 'created_at', 'updated_at']
    search_fields = ['name']
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class TodoDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoModelSerializer
    permission_classes = [IsUserItself]
    queryset = Todo.objects.all()


__all__ = [
    'TodoListCreateAPI',
    'TodoDetailAPI'
]