from django.urls import path, include

from .views import years

urlpatterns = [
    path("years", years.YearCreateAPI.as_view()),
    path("years/<int:pk>", years.YearRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/years", years.SchoolYearsListAPI.as_view()),
]