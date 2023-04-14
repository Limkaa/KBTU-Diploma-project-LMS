from rest_framework import serializers

from ..models import Room


class RoomModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Room
        fields = "__all__"
        read_only_fields = ['school', 'created_at', 'updated_at']


__all__ = [
    "RoomModelSerializer",
]