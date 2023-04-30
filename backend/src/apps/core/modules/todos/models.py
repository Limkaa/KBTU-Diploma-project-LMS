from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.models import CustomModel

from ..users.models import User

class Todo(CustomModel):
    user = models.ForeignKey(
        to=User,
        related_name="todos",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=True)
    is_done = models.BooleanField(default=False)
    priority = models.SmallIntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(3)
        ]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'user', 'created_at']

    class Meta:
        ordering = ['is_done', '-priority']

    def __str__(self) -> str:
        return self.name
