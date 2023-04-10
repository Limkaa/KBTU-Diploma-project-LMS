from rest_framework import serializers

from ..models import Timebound


class TimeboundModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Timebound
        fields = "__all__"
        read_only_fields = ['school', 'created_at', 'updated_at']


__all__ = [
    "TimeboundModelSerializer",
]