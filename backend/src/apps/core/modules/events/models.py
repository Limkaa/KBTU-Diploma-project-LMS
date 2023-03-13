from django.db import models


class Event(models.Model):
    school = models.ForeignKey(
        to="schools.School",
        related_name="events",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    title = models.CharField(max_length=250, blank=False)
    text = models.TextField(blank=False)
    datetime = models.DateTimeField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
