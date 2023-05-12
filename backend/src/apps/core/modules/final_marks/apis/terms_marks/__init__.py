from django.urls import path

from . import detail, list_create, student

urlpatterns = [
    path('terms-marks/<int:pk>', detail.TermMarkDetailAPI.as_view(), name="term-mark-detail"),
    path('courses/<int:course_id>/terms-marks', list_create.CourseTermMarkListCreateAPI.as_view(), name="course-terms-marks"),
    path('students/<int:student_id>/terms-marks', student.StudentTermMarksListAPI.as_view(), name="student-terms-marks"),
]