from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

from ...utils.exceptions import ResponseDetails
from ...utils.models import CustomModel

from ..students.models import Student
from ..schools.models import School


class Community(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name="communities",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=False)
    link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'school', 'created_at']

    class Meta:
        verbose_name = "Community"
        verbose_name_plural = "Communities"
        unique_together = ['school', 'name']
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class Membership(CustomModel):
    community = models.ForeignKey(
        to=Community,
        related_name='members',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    student = models.ForeignKey(
        to=Student,
        related_name="communities",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'community', 'student', 'created_at']
    
    class Meta:
        unique_together = ['community', 'student']
        ordering = ["-created_at"]
    
    def __str__(self) -> str:
        return f"{self.community} - {self.student}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.community.school != self.student.user.school:
            errors.add_field_message('student', "Student can't participate in other schools communities")
        
        if errors:
            raise ValidationError(errors.map)