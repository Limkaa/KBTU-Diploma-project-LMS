from django.urls import path

from . import views

urlpatterns = [
    path('schools-posts-comments/<int:pk>', views.SchoolPostCommentRetrieveUpdateDestroyAPI.as_view()),
    path('schools-posts/<int:post_id>/comments', views.SchoolPostCommentsListCreateAPI.as_view())
]