from django.urls import path, include

from . import views

urlpatterns = [
    path('grades', views.GradeCreateAPI.as_view()),
    path('grades/<int:pk>', views.GradeRetrieveUpdateAPI.as_view()),
    path('schools/<int:school_id>/grades', views.SchoolGradesListAPI.as_view()),
]