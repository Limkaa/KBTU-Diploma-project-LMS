from django.urls import path, include

from . import views

urlpatterns = [
    path("subjects", views.SubjectCreateAPI.as_view()),
    path("subjects/<int:pk>", views.SubjectRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/subjects", views.SchoolSubjectsListAPI.as_view()),
    path("grades/<int:grade_id>/subjects", views.GradeSubjectsListAPI.as_view()),
]