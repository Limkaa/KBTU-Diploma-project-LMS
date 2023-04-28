from rest_framework import serializers

from . import (
    AwardModelSerializer,
    StatsSerializerMixin,
    RecentWinnersSerializerMixin
)


class AwardWithStatsSerializer(
    AwardModelSerializer,
    StatsSerializerMixin
):
    pass
    

class AwardsStatsWithRecentWinnersSerializer(
    AwardWithStatsSerializer,
    RecentWinnersSerializerMixin
):
    pass


__all__ = [
    'AwardWithStatsSerializer',
    'AwardsStatsWithRecentWinnersSerializer'
]