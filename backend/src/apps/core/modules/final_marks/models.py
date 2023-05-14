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

    TERM_MARK_RATING_MULTIPLIER = 3

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
    
    @property
    def rating_points(self):
        return self.number * self.TERM_MARK_RATING_MULTIPLIER
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.term.is_closed:
            errors.add_field_message('term', "Term is closed, so you can't create or update mark")

        if self.term.year != self.enrollment.year:
            errors.add_field_message('term', "Enrollment year is different from term year")
        
        if errors:
            raise ValidationError(errors.map)


class YearMark(CustomModel):
    enrollment = models.OneToOneField(
        to=Enrollment,
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
        related_name="issued_year_marks",
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    YEAR_MARK_RATING_MULTIPLIER = 5
    
    non_updatable_fields = ["id", "enrollment", "created_at"]
    
    related_fields = [
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
    
    def __str__(self) -> str:
        return f"{self.enrollment.student} got {self.number} for {self.enrollment.subject}"
    
    @property
    def rating_points(self):
        return self.number * self.YEAR_MARK_RATING_MULTIPLIER
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if not self.enrollment.year.is_opened_to_marks:
            errors.add_field_message('number', "Year is not opened to evaluation")

        if errors:
            raise ValidationError(errors.map)