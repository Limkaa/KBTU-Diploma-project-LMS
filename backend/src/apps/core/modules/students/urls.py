from django.urls import path, include

from . import views

urlpatterns = [
    path("students/<int:user_id>", views.StudentCardRetrieveUpdateAPI.as_view()),
    path("groups/<int:group_id>/students", views.GroupStudentsListAPI.as_view()),
    path("schools/<int:school_id>/students", views.SchoolStudentsListAPI.as_view())
]