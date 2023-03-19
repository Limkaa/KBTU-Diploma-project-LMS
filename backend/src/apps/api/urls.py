from django.urls import include, path

urlpatterns = [
    path("auth/", include(("apps.authentication.urls", "authentication"))),
    path("", include(("apps.core.modules.users.urls", "users"))),
    path("", include(("apps.core.modules.grades.urls", "grades"))),
    path("", include(("apps.core.modules.schools.urls", "schools"))),
]
