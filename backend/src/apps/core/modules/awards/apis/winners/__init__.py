from django.urls import path

from .winners import *


urlpatterns = [
   path('winners/<int:pk>', WinnerDetailAPI.as_view(), name='winner-detail'),
   path('awards/<int:award_id>/winners', AwardWinnersListAPI.as_view(), name='award-winners'),
   path('schools/<int:school_id>/winners', SchoolWinnersListAPI.as_view(), name='school-winners'),
   path('students/<int:student_id>/awards', StudentAwardsListAPI.as_view(), name='student-awards'),
   path('users/<int:user_id>/issued-winners', IssuedWinnersListAPI.as_view(), name='issued-winners'),
   path('courses/<int:course_id>/winners', CourseWinnersListCreatAPI.as_view(), name='course-winners'),
]