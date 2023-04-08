from django.urls import path, include

from . import views

urlpatterns = [
    path("syllabus/<int:pk>", views.SyllabusRetrieveUpdateDestroyAPI.as_view()),
    path("courses/<int:course_id>/syllabus", views.SyllabusListCreateAPI.as_view()),
]