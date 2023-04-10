from django.db import models
from django.core.exceptions import ValidationError

from ..users.models import User
from ..schools.models import School
from ..terms.models import Year
from ..subjects.models import Subject
from ..groups.models import Group

from ...utils.exceptions import ResponseDetails

class Course(models.Model):
    school = models.ForeignKey(
        to=School,
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    year = models.ForeignKey(
        to=Year,
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False
    )
    teacher = models.ForeignKey(
        to=User,
        related_name="courses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    group = models.ForeignKey(
        to=Group,
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    subject = models.ForeignKey(
        to=Subject,
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ["id", "school", "subject", "group", "year", "created_at"]
    
    class Meta:
        unique_together = ["group", "subject"]

    def __str__(self) -> str:
        return str(self.subject)
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        def check_same_school(object, key: str):
            if object.school != self.school:
                message = "Specified object must belong to same school"
                errors.add_field_message(key, message)
        
        if self.teacher is not None:
            key = "teacher"
            teacher = self.teacher
            
            check_same_school(teacher, key)
            
            if teacher.role != User.Role.TEACHER:
                message = "User must have 'teacher' role"
                errors.add_field_message(key, message)
            
        check_same_school(self.year, "year")
        check_same_school(self.group, "group")
        check_same_school(self.subject, "subject")
        
        if errors:
            raise ValidationError(errors.map)
    
    def get_updatable_fields(self) -> list[str]:
        all_fields = [str(f.name) for f in Course._meta.fields]
        updatable_fields = list(set(all_fields) - set(self.non_updatable_fields))
        return updatable_fields
    
    def save(self, *args, **kwargs):
        self.full_clean()
        if self.pk is None:
            return super().save(*args, **kwargs)
        super().save(update_fields=self.get_updatable_fields(), *args, **kwargs)
