from django.urls import path

from . import views

urlpatterns = [
    path("timebounds/<int:pk>", views.TimeboundRetrieveUpdateDestroyAPI.as_view()),
    path("schools/<int:school_id>/timebounds", views.SchoolTimeboundsListCreateAPI.as_view()),
]