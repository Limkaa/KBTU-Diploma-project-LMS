from rest_framework import serializers

from ..models import Award


class AwardModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = "__all__"
        read_only_fields = Award.non_updatable_fields


__all__ = [
    'AwardModelSerializer'
]