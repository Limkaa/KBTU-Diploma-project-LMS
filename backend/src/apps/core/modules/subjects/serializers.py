from rest_framework import serializers

from .models import Subject

from ..grades.serializers import GradeModelSerializer


class SubjectModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Subject
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


class SubjectModelNestedSerializer(SubjectModelSerializer):
    grade = GradeModelSerializer(read_only=True)


class SubjectModelCreateUpdateSerializer(SubjectModelSerializer):
    def to_representation(self, instance):
        serializer = SubjectModelNestedSerializer(instance)
        return serializer.data