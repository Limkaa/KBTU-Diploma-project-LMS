from rest_framework import serializers

from .awards import AwardModelSerializer
from ...users.serializers import UserPublicSerializer
from ...students.serializers import StudentModelNestedSerializer

from ..models import Winner


class WinnerModelSerializer(serializers.ModelSerializer):
    days_from_creation = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Winner
        fields = '__all__'
        read_only_fields = Winner.non_updatable_fields


class WinnerNestedSerializer(WinnerModelSerializer):
    student = StudentModelNestedSerializer(read_only=True)
    issued_by = UserPublicSerializer(read_only=True)
    award = AwardModelSerializer(read_only=True)


class WinnerCreateUpdateSerializer(WinnerModelSerializer):
    class Meta(WinnerModelSerializer.Meta):
        read_only_fields = ['id', 'issued_by', 'created_at']
        
    def to_representation(self, instance):
        return WinnerNestedSerializer(instance).data


__all__ = [
    'WinnerModelSerializer',
    'WinnerNestedSerializer',
    'WinnerCreateUpdateSerializer'
]