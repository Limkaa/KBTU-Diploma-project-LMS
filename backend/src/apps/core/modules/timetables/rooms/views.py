from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ...permissions import *

from ..models import School, Room
from .serializers import *


class SchoolRoomsListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    serializer_class = RoomModelSerializer
    ordering = ['name', 'created_at', 'updated_at']
    search_fields = ['name']
    
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
        return Room.objects.filter(school=self.school)


class RoomRetrieveUpdateDestroyAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RoomModelSerializer
    queryset = Room.objects.all()
    
    def get_object(self):
        room: Room = get_object_or_404(Room, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, room.school)
        return room
    
    def get_permissions(self):
        method = self.request.method
        
        if method in ["DELETE", "PUT"]:
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool]

        return super().get_permissions()

