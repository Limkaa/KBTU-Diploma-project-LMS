from django.urls import path, include

from . import views

urlpatterns = [
    path("assignments/<int:pk>", views.AssignmentRetrieveUpdateDestroyAPI.as_view()),
    path("courses/<int:course_id>/assignments", views.CourseAssignmentsListCreateAPI.as_view()),
]