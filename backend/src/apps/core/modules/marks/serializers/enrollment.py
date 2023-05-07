from rest_framework import serializers

from .base import MarkModelSerializer
from ...enrollments.serializers import EnrollmentNestedSerializer


class MarksGroupedByEnrollmentSerializer(EnrollmentNestedSerializer):
    marks = MarkModelSerializer(read_only=True, many=True)
    average_mark = serializers.DecimalField(read_only=True, max_digits=3, decimal_places=2)