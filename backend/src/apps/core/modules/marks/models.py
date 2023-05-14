from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..assignments.models import Assignment
from ..students.models import Student
from ..enrollments.models import Enrollment
from ..users.models import User


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
    last_edited_by = models.ForeignKey(
        to=User,
        related_name="issued_marks",
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    MARK_RATING_MULTIPLIER = 1

    non_updatable_fields = ["id", "assignment", "enrollment", "created_at"]
    
    related_fields = [
        'assignment',
        'assignment__course',
        'assignment__course__school',
        'assignment__course__teacher',
        'assignment__course__subject',
        'assignment__course__subject__grade',
        'assignment__course__year',
        'assignment__course__group',
        'assignment__course__group__teacher',
        'assignment__course__group__grade',
        'assignment__term',
        'enrollment',
        'enrollment__subject',
        'enrollment__subject__grade',
        'enrollment__year',
        'enrollment__course',
        'enrollment__student',
        'enrollment__student__user',
        'enrollment__student__group',
        'enrollment__student__group__grade',
        'enrollment__student__group__teacher',
        'last_edited_by'
    ]
    
    class Meta:
        unique_together = ['assignment', 'enrollment']
    
    def __str__(self) -> str:
        return f"{self.enrollment.student} got {self.number} for {self.assignment}"
    
    @property
    def rating_points(self):
        return self.number * self.MARK_RATING_MULTIPLIER
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.assignment.term.is_closed:
            errors.add_field_message('term', "Term is closed, so you can't create or update assignment mark")
        
        if self.enrollment.course != self.assignment.course:
            errors.add_field_message('assignment', "Enrollment course is different from assignment course")
        
        if errors:
            raise ValidationError(errors.map)
            
        
    