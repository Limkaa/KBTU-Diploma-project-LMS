from django.db import models


class Grade(models.Model):
    school = models.ForeignKey(
        to="schools.School",
        related_name="groups",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=100, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['school', 'name']

    def __str__(self) -> str:
        return self.name
