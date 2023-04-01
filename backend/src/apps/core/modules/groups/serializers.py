from rest_framework import serializers

from .models import Group

from ..grades.serializers import GradeModelSerializer
from ..users.serializers import UserPublicSerializer


class GroupModelSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Group
        fields = "__all__"


class GroupModelReadOnlySerializer(GroupModelSerializer):
    grade = GradeModelSerializer(read_only=True)
    teacher = UserPublicSerializer(read_only=True)