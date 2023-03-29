from django.db import models
from django.core.exceptions import ValidationError
from ..schools.models import School
from ..grades.models import Grade

class Subject(models.Model):
    school = models.ForeignKey(
        to=School,
        related_name="subjects",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    grade = models.ForeignKey(
        to=Grade,
        related_name="subjects",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    code = models.CharField(max_length=30, blank=False, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['school', 'code']

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"
    
    def clean(self):    
        if self.grade.school != self.school:
            raise ValidationError("This grade cannot be assigned to a subject as they belong to different schools")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
