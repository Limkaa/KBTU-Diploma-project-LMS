from django.urls import include, path

urlpatterns = [path("core/", include("apps.core.api.urls", "core"))]
