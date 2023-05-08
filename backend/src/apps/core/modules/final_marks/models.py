from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..terms.models import Term
from ..enrollments.models import Enrollment
from ..users.models import User


class TermMark(CustomModel):
    enrollment = models.ForeignKey(
        to=Enrollment,
        related_name="terms_marks",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    term = models.ForeignKey(
        to=Term,
        related_name="terms_marks",
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
        related_name="issued_terms_marks",
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ["id", "enrollment", "term", "created_at"]
    
    related_fields = [
        'term',
        'term__year',
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
        unique_together = ['enrollment', 'term']
    
    def __str__(self) -> str:
        return f"{self.enrollment.student} got {self.number} for {self.term} of {self.enrollment.subject}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.term.is_closed:
            errors.add_field_message('term', "Term is closed, so you can't create or update mark")

        if self.term.year != self.enrollment.year:
            errors.add_field_message('term', "Enrollment year is different from term year")
        
        if errors:
            raise ValidationError(errors.map)