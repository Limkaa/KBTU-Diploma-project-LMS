from django.urls import path, include

from .views import years, terms

urlpatterns = [
    path("years", years.YearCreateAPI.as_view()),
    path("years/<int:pk>", years.YearRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/years", years.SchoolYearsListAPI.as_view()),
    
    path("terms", terms.TermCreateAPI.as_view()),
    path("terms/<int:pk>", terms.TermRetrieveUpdateAPI.as_view()),
    path("years/<int:year_id>/terms", terms.AcademicYearTermsListAPI.as_view()),
]