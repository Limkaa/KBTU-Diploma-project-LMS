from rest_framework import serializers

from ..models import Enrollment


class EnrollmentModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"
        read_only_fields = Enrollment.non_updatable_fields