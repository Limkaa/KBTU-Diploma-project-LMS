from django.urls import path, include

from . import views

urlpatterns = [
    path("marks/<int:pk>", views.MarkRetrieveUpdateDestroyAPI.as_view()),
    path("assignments/<int:assignment_id>/marks", views.AssignmentMarksListCreateAPI.as_view()),
    path("students/<int:student_id>/marks", views.StudentAllMarksListAPI.as_view()),
    path("courses/<int:course_id>/terms/<int:term_id>/marks", views.CourseAllMarksListAPI.as_view()),
]