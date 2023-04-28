from django.urls import include

from . import awards, winners, statistics


urlpatterns = [
    *awards.urlpatterns,
    *winners.urlpatterns,
    *statistics.urlpatterns
]