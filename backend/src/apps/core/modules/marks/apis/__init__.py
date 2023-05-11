from django.urls import path

from . import detail, assignment_marks, course_marks, student_marks

urlpatterns = [
    path('marks/<int:pk>', detail.MarkDetailAPI.as_view(), name='mark-detail'),
    path('assignments/<int:assignment_id>/marks', assignment_marks.AssignmentMarksListCreateAPI.as_view(), name='assignment-marks'),
    path('assignments/<int:assignment_id>/marks-grouped', assignment_marks.EnrollmentsAssignmentMarksListAPI.as_view(), name='assignment-marks-grouped'),
    path('courses/<int:course_id>/marks-list', course_marks.CourseMarksListAPI.as_view(), name='course-marks-list'),
    path('courses/<int:course_id>/marks', course_marks.CourseMarksGroupedByEnrollmentListAPI.as_view(), name='course-marks'),
    path('students/<int:student_id>/marks-list', student_marks.StudentMarksListAPI.as_view(), name='student-marks-list'),
    path('students/<int:student_id>/marks', student_marks.StudentMarksGroupedByEnrollmentListAPI.as_view(), name='student-marks'),
]