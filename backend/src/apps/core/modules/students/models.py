from django.db import models
from django.core.exceptions import ValidationError

from ..users.models import User
from ..groups.models import Group

class Student(models.Model):
    group = models.ForeignKey(
        Group,
        related_name="students",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    user = models.OneToOneField(
        to=User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.user)
    
    def clean(self) -> None:
        if self.user.role != User.Role.STUDENT:
            raise ValidationError(f"User with role '{self.user.role}' can't have students card")
        
        if self.group is not None:
            if self.group.school != self.user.school:
                raise ValidationError("This user cannot be assigned to this group as they belong to different schools")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
