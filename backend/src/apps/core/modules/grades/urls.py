from django.urls import path, include

from . import views

urlpatterns = [
    path('schools/<int:school_id>/grades', views.GradeListCreateAPI.as_view()),
    path('grades/<int:pk>', views.GradeRetrieveUpdateAPI.as_view()),
]