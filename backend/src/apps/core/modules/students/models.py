from django.db import models
from django.conf import settings


class Student(models.Model):
    group = models.ForeignKey(
        "groups.Group",
        related_name="students",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="students",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.user
