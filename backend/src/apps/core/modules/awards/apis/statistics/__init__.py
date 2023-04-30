from django.urls import path

from .statistics import *

urlpatterns = [
    path('schools/<int:school_id>/awards-overview', SchoolAwardsStatsListAPI.as_view(), name='school-awards-stats'),
    path('students/<int:student_id>/awards-overview', StudentAwardsStatsListAPI.as_view(), name='student-awards-stats'),
    path('courses/<int:course_id>/awards-overview', CourseAwardsStatsListAPI.as_view(), name='course-awards-stats'),
    path('users/<int:user_id>/issued-winners-overview', IssuedAwardsStatsListAPI.as_view(), name='issued-awards-stats')
]