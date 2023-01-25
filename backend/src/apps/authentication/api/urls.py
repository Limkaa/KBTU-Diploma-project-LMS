from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/new/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/check/", TokenVerifyView.as_view(), name="token_verify"),
]
