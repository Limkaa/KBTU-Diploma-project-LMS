from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from . import serializers
from ..permissions import *

from .models import User
from ..schools.models import School

from apps.core.utils.pagination import OptionalPaginationListAPIView


class OwnProfileAPI(APIView):
    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)


class UsersListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = serializers.UserCreateSerializer

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
