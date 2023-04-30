from django.urls import path, include

from . import communities, memberships

urlpatterns = [
    *communities.urlpatterns,
    *memberships.urlpatterns
]