from django.urls import path, include

from . import views


urlpatterns = [
    path('schools/<int:pk>', views.SchoolRetrieveUpdateAPI.as_view())
]