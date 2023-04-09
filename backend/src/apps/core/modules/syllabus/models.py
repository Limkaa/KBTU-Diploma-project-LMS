from django.db import models
from ...utils.models import CustomModel

from ..courses.models import Course

class Syllabus(CustomModel):
    course = models.ForeignKey(
        to=Course,
        related_name="syllabus",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=True)
    hours = models.PositiveSmallIntegerField(null=False, blank=False)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ["id", "course", "created_at"]
    
    class Meta:
        verbose_name_plural = "Syllabuses"

    def __str__(self) -> str:
        return self.name
