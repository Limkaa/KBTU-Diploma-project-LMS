from django.db import models
from django.core.exceptions import ValidationError

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..courses.models import Course
from ..terms.models import Term

class Assignment(CustomModel):
    course = models.ForeignKey(
        to=Course,
        related_name="assignments",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    term = models.ForeignKey(
        to=Term,
        related_name="assignments",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    datetime = models.DateTimeField(blank=False)
    name = models.CharField(max_length=255, blank=False)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ["id", "course", "term", "created_at"]
    
    def __str__(self) -> str:
        return self.name
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.term.year != self.course.year:
            errors.add_field_message("term", "This term does not belong to academic year of specified course")

        term_from_date = self.term.from_date
        term_to_date = self.term.to_date
        
        if self.datetime.date() < term_from_date or self.datetime.date() > term_to_date:
            errors.add_field_message("term", f"Datetime must be between {term_from_date} and {term_to_date}")

        if errors:
            raise ValidationError(errors.map)
