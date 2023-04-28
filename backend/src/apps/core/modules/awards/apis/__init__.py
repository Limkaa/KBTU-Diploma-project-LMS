from django.urls import include

from . import awards


urlpatterns = [
    *awards.urlpatterns
]