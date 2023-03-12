from django.urls import include, path

from . import views

urlpatterns = [
    path("users/me", views.OwnProfileAPI.as_view()),
    path("schools/<int:school_id>/users", views.UsersListCreateAPI.as_view()),
]
