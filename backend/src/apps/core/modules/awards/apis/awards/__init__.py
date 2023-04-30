from django.urls import path

from .awards import *


urlpatterns = [
    path('awards/<int:pk>', AwardDetailAPI.as_view(), name='awards-detail'),
    path('schools/<int:school_id>/awards', SchoolAwardsListCreateAPI.as_view(), name='school-awards')
]