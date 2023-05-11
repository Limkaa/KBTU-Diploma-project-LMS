from django.urls import path

from . import detail, list_create, student

urlpatterns = [
    path('years-marks/<int:pk>', detail.YearMarkDetailAPI.as_view(), name="year-mark-detail"),
    path('courses/<int:course_id>/years-marks', list_create.CourseYearMarkListCreateAPI.as_view(), name="course-years-marks"),
    path('students/<int:student_id>/years-marks', student.StudentYearMarksListAPI.as_view(), name="student-years-marks"),
]