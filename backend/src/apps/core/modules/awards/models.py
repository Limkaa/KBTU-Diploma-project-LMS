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


class Award(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name="awards",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    
    issued_by_course_teacher=models.BooleanField(default=True)
    issued_by_group_teacher=models.BooleanField(default=True)
    issued_by_manager=models.BooleanField(default=True)
    
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

    class Meta:
        unique_together = ['school', 'name']

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
        related_name="issued_awards",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    comment = models.TextField(blank=True)
    group = models.ForeignKey(
        to=Group,
        related_name="awards",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    course = models.ForeignKey(
        to=Course,
        related_name="awards",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    date = models.DateField(default=datetime.date.today, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'student', 'award', 'issued_by', 'course', 'group', 'date', 'created_at']

    def __str__(self) -> str:
        return f"{self.student} was awarded with {self.award}"
    
    @property
    def days_from_creation(self):
        return (datetime.date.today() - self.created_at.date()).days
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.award.school != self.student.user.school:
            errors.add_field_message('award', "Award's school is different from student school")
        
        if not self.award.is_active:
            errors.add_field_message('award', "Award is not active right now")
            
        if self.course and self.course.group != self.student.group:
            errors.add_field_message('course', "This course does not learned by specified student")
        
        if self.group and self.group != self.student.group:
            errors.add_field_message('group', "Group is different from student's group")
        
        if self.group and self.course:
            errors.add_field_message('group-course', "Both group and course can't be specified at the same time")
        
        if self.comment and self.days_from_creation > 3:
            raise ValidationError("Winner award can't be updated after 3 days from creation date")
        
        if errors:
            raise ValidationError(errors.map)
        
        return super().clean()
