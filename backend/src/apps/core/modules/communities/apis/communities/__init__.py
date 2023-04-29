from django.urls import path

from .views import *

urlpatterns = [
    path('schools/<int:school_id>/communities', SchoolCommunitiesListCreateAPI.as_view(), name='school-communities'),
    path('communities/<int:pk>', CommunityDetailAPI.as_view(), name='community-detail')
]