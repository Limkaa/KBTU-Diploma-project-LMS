from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from . import serializers
from ..permissions import IsManager, OnlyOwnSchool, OnlyOwnSchoolObject

from .models import User

from apps.core.utils.pagination import OptionalPaginationListAPIView


class OwnProfileAPI(APIView):
    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)


class UsersListCreateAPI(generics.ListCreateAPIView, OptionalPaginationListAPIView):
    permission_classes = [IsManager, OnlyOwnSchool]
    serializer_class = serializers.UserCreateSerializer

    def get_queryset(self):
        return User.objects.filter(school=self.kwargs["school_id"])

    def perform_create(self, serializer):
        serializer.save(school_id=self.kwargs["school_id"])


class UserDetailAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [IsManager, OnlyOwnSchoolObject]
    serializer_class = serializers.UserSerializer
    queryset = User.objects.all()
