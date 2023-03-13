from django.db import models
from django.conf import settings


class Todo(models.Model):
    created_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="todos",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=True)
    is_done = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
