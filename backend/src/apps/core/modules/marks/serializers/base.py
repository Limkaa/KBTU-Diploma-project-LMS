from rest_framework import serializers

from ...enrollments.serializers import EnrollmentNestedSerializer
from ...assignments.serializers import AssignmentModelNestedSerializer
from ...users.serializers import UserPublicSerializer

from ..models import Mark


class MarkModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Mark
        fields = "__all__"
        read_only_fields = ['assignment', 'enrollment', 'last_edited_by', 'created_at', 'updated_at']


class MarkNestedSerializer(MarkModelSerializer):
    assignment = AssignmentModelNestedSerializer(read_only=True)
    enrollment = EnrollmentNestedSerializer(read_only=True)
    last_edited_by = UserPublicSerializer(read_only=True)
    