from django.urls import path

from . import views

urlpatterns = [
    path("schools-posts/<int:pk>", views.SchoolPostRetrieveUpdateDestroyAPI.as_view()),
    path("schools/<int:school_id>/posts", views.SchoolPostsListCreateAPI.as_view()),
]