from django.urls import include, path

from . import views

urlpatterns = [
    path("users/me", views.OwnProfileAPI.as_view()),
    path("users/<int:pk>", views.UserDetailAPI.as_view()),
    path("schools/<int:school_id>/users", views.UsersListCreateAPI.as_view()),
    path("schools/<int:school_id>/teachers", views.SchoolTeachersList.as_view()),
    path("schools/<int:school_id>/students", views.SchoolStudentsList.as_view()),
    path("schools/<int:school_id>/managers", views.SchoolManagersList.as_view()),
]
