from django.urls import path

from . import views

urlpatterns = [
    path('courses-posts-comments/<int:pk>', views.CoursePostCommentRetrieveUpdateDestroyAPI.as_view()),
    path('courses-posts/<int:post_id>/comments', views.CoursePostCommentsListCreateAPI.as_view())
]