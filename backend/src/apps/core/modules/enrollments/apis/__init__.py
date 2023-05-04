from django.urls import path

from . import details, course_enrollments, lists


urlpatterns = [
    path('courses/<int:course_id>/enrollments/<int:pk>', details.EnrollmentDetailAPI.as_view(), name='enrollment-detail'),
    path('courses/<int:course_id>/enrollments', course_enrollments.ListCreateAPI.as_view(), name='course-enrollments'),
    path('courses/<int:course_id>/not-enrolled-students', lists.NotEnrolledStudentListAPI.as_view(), name='not-enrolled-students'),
    path('courses/<int:course_id>/transferred-enrollments', lists.TransferredEnrollmentsListAPI.as_view(), name='transferred-enrollments'),
]