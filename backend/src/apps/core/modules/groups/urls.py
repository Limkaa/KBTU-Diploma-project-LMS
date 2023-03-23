from django.urls import path, include

from . import views

urlpatterns = [
    path("groups", views.GroupCreateAPI.as_view()),
    path("groups/<int:pk>", views.GroupRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/groups", views.SchoolGroupsListCreateAPI.as_view()),
    path("teachers/<int:teacher_id>/groups", views.TeacherGroupsListAPI.as_view()),
    path("grades/<int:grade_id>/groups", views.GradeGroupsListAPI.as_view()),
]