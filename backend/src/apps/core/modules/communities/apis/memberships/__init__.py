from django.urls import path

from .views import *

urlpatterns = [
    path('communities/<int:community_id>/memberships', CommunityMembersListCreateAPI.as_view(), name="community-memberships"),
    path('students/<int:student_id>/memberships', StudentMembershipsListAPI.as_view(), name="student-memberships"),
    path('memberships/<int:pk>', MembershipDetailAPI.as_view(), name='membership-detail'),
]