from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..assignments.models import Assignment
from ..students.models import Student


class Mark(CustomModel):
    assignment = models.ForeignKey(
        to=Assignment,
        related_name="marks",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    student = models.ForeignKey(
        to=Student,
        related_name='marks',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    number = models.PositiveSmallIntegerField(
        blank=False, null=False,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ["id", "assigment", "student", "number", "created_at"]
    
    def __str__(self) -> str:
        return f"{self.number} - {self.student}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.student.group != self.assignment.course.group:
            errors.add_field_message('assignment', "This assignment belongs to course, which is not learned by specified student")
        
        if errors:
            raise ValidationError(errors.map)
            
        
    