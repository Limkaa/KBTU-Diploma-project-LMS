from django.db import models
from django.core.exceptions import ValidationError

from ..users.models import User
from ..schools.models import School
from ..grades.models import Grade

class Group(models.Model):
    school = models.ForeignKey(
        to=School,
        related_name="students_groups",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    teacher = models.ForeignKey(
        to=User,
        related_name="supervised_groups",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    grade = models.ForeignKey(
        to=Grade,
        related_name="students_groups",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    
    code = models.CharField(max_length=30, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['school', 'code']

    def __str__(self) -> str:
        return f"{self.grade} ({self.code})"

    def clean(self):
        validation_error = "This {object} cannot be assigned to a group as they belong to different schools"
        
        if self.grade.school != self.school:
            raise ValidationError(validation_error.format(object='grade'))
        
        if self.teacher is not None:
            if self.teacher.role != User.Role.TEACHER:
                raise ValidationError(f"User with role '{self.teacher.role}' cannot be teacher of group")
            
            if self.teacher.school != self.school:
                raise ValidationError(validation_error.format(object='teacher'))
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)