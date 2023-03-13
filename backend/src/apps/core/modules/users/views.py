from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics

from . import serializers
from .permissions import IsManager, OnlyOwnSchool

from .models import User


class OwnProfileAPI(APIView):
    def get(self, request):
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data)


class UsersListCreateAPI(generics.ListCreateAPIView):
    permission_classes = [IsManager, OnlyOwnSchool]
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return User.objects.filter(school=self.kwargs["school_id"])

    def perform_create(self, serializer):
        serializer.save(school_id=self.kwargs["school_id"])
