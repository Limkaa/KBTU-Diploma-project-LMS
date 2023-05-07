from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..assignments.models import Assignment
from ..students.models import Student
from ..enrollments.models import Enrollment


class Mark(CustomModel):
    assignment = models.ForeignKey(
        to=Assignment,
        related_name="marks",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    enrollment = models.ForeignKey(
        to=Enrollment,
        related_name="marks",
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

    non_updatable_fields = ["id", "assignment", "enrollment", "created_at"]
    
    class Meta:
        unique_together = ['assignment', 'enrollment']
    
    def __str__(self) -> str:
        return f"{self.enrollment.student} got {self.number} for {self.assignment}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.assignment.term.is_closed:
            errors.add_field_message('term', "Term is closed, so you can't create or update assignment mark")
        
        if self.enrollment.course != self.assignment.course:
            errors.add_field_message('assignment', "Enrollment course is different from assignment course")
        
        if errors:
            raise ValidationError(errors.map)
            
        
    