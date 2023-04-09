from django.urls import path

from . import views

urlpatterns = [
    path("courses-posts/<int:pk>", views.CoursePostRetrieveUpdateDestroyAPI.as_view()),
    path("courses/<int:course_id>/posts", views.CoursePostsListCreateAPI.as_view()),
]