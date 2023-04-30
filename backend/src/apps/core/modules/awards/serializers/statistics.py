from rest_framework import serializers

from .winners import WinnerNestedSerializer

class StatsSerializerMixin(serializers.Serializer):
    issued_total = serializers.IntegerField(read_only=True)

class RecentWinnersSerializerMixin(serializers.Serializer):
    recent_winners = WinnerNestedSerializer(many=True)


__all__ = [
    'StatsSerializerMixin',
    'RecentWinnersSerializerMixin'
]