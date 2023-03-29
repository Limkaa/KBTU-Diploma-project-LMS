from rest_framework import serializers

from .models import Student

from ..groups.serializers import GroupModelReadOnlySerializer
from ..users.serializers import UserPublicSerializer


class StudentModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Student
        fields = "__all__"
        read_only_fields = ['user']


class StudentModelNestedSerializer(StudentModelSerializer):
    group = GroupModelReadOnlySerializer(read_only=True)
    user = UserPublicSerializer(read_only=True)


class StudentModelSerializerPut(StudentModelSerializer):
    def to_representation(self, instance):
        serializer = StudentModelNestedSerializer(instance)
        return serializer.data