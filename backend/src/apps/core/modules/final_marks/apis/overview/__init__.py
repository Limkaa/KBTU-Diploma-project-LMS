from django.urls import path

from . import course, student


urlpatterns = [
    path('courses/<int:course_id>/final-marks', course.CourseFinalMarksOverviewAPI.as_view(), name='course-final-marks'),
    path('students/<int:student_id>/final-marks', student.StudentFinalMarksOverviewAPI.as_view(), name='student-final-marks')
]