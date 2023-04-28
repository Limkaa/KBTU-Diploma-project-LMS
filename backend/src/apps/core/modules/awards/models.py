import datetime

from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.exceptions import ResponseDetails
from ...utils.models import CustomModel

from ..students.models import Student, Group
from ..courses.models import Course
from ..schools.models import School

from .managers import AwardManager, WinnerManager

class Award(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name="awards",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    
    name = models.CharField(max_length=250, blank=False)
    description = models.TextField(blank=True)
    
    points = models.PositiveIntegerField(
        blank=False,
        default=1,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(50)
        ],
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'school', 'created_at']

    objects = AwardManager()

    related_fields = ['school']
    
    class Meta:
        unique_together = ['school', 'name']
        ordering= ('-created_at',)

    def __str__(self) -> str:
        return self.name


class Winner(CustomModel):
    student = models.ForeignKey(
        to=Student,
        related_name="awards",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    award = models.ForeignKey(
        to=Award,
        related_name="winners",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    issued_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="issued_winners",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    comment = models.TextField(blank=True)
    course = models.ForeignKey(
        to=Course,
        related_name="winners",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'student', 'award', 'issued_by', 'course', 'created_at']

    related_fields = [
        'student',
        'student__group',
        'student__group__school',
        'student__group__grade',
        'student__group__teacher',
        'student__user',
        'award',
        'issued_by',
    ]

    objects = WinnerManager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.student} was awarded with {self.award}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.award.school != self.student.user.school:
            errors.add_field_message('award', "Award's school is different from student school")
        
        if not self.award.is_active:
            errors.add_field_message('award', "Award is not active right now")
            
        if self.course and self.course.group != self.student.group:
            errors.add_field_message('course', "This course does not learned by specified student")

        if errors:
            raise ValidationError(errors.map)
        
        return super().clean()
