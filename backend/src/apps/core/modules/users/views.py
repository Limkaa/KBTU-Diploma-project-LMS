from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.generics import get_object_or_404

from . import serializers
from ..permissions import *

from .models import User
from ..schools.models import School

from apps.core.utils.pagination import OptionalPaginationListAPIView


class OwnProfileAPI(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserSerializer
    
    def get_object(self):
        return get_object_or_404(User, pk=self.request.user.pk)


class UsersListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = serializers.UserCreateSerializer
    filterset_fields = ['gender', 'is_active', 'role']
    ordering = ['date_of_birth', 'first_name', 'last_name', 'rating', 'updated_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone', 'telegram_id']

    def check_school(self):
        school = generics.get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)

    def get_queryset(self):
        self.check_school()
        return User.objects.filter(school=self.kwargs["school_id"])

    def perform_create(self, serializer):
        self.check_school()
        serializer.save(school_id=self.kwargs["school_id"])


class UserDetailAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all()


class SchoolTeachersList(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = serializers.UserPublicSerializer
    queryset = User.objects.all()
    role = User.Role.TEACHER
    filterset_fields = ['gender', 'is_active']
    ordering = ['first_name', 'last_name', 'rating', 'updated_at']
    search_fields = ['first_name', 'last_name', 'email']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(School, pk=self.kwargs['school_id'])
        self.check_object_permissions(request, self.school)

    def get_queryset(self):
        return self.queryset.filter(school=self.school, role=self.role)

class SchoolManagersList(SchoolTeachersList):
    role = User.Role.MANAGER