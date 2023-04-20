from rest_framework import serializers

from .models import Assignment

from ..terms.serializers import TermModelSerializer
from ..courses.serializers import CourseModelSerializer


class AssignmentModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Assignment
        fields = "__all__"
        read_only_fields = ['course', 'term', 'created_at', 'updated_at']


class AssignmentModelNestedSerializer(AssignmentModelSerializer):
    term = TermModelSerializer(read_only=True)
    course = CourseModelSerializer(read_only=True)


class UpdateAssignmentSerializer(AssignmentModelSerializer):
    def to_representation(self, instance):
        serializer = AssignmentModelNestedSerializer(instance)
        return serializer.data


class CreateAssignmentSerializer(AssignmentModelSerializer):
    class Meta(AssignmentModelSerializer.Meta):
        read_only_fields = ['course', 'created_at', 'updated_at']
        
    def to_representation(self, instance):
        serializer = AssignmentModelNestedSerializer(instance)
        return serializer.data


__all__ = [
    "AssignmentModelSerializer",
    "AssignmentModelNestedSerializer",
    "UpdateAssignmentSerializer",
    "CreateAssignmentSerializer"
]