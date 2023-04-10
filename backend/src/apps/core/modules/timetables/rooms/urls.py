from django.urls import path

from . import views

urlpatterns = [
    path("rooms/<int:pk>", views.RoomRetrieveUpdateDestroyAPI.as_view()),
    path("schools/<int:school_id>/rooms", views.SchoolRoomsListCreateAPI.as_view()),
]