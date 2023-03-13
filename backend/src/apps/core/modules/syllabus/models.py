from django.db import models


class Syllabus(models.Model):
    course = models.ForeignKey(
        to="courses.Course",
        related_name="syllabus",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=True)
    hours = models.PositiveSmallIntegerField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
