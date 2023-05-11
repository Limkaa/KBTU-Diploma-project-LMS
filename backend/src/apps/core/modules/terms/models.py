import datetime

from django.db import models
from django.core.exceptions import ValidationError

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..schools.models import School


class Year(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name="years",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    is_active = models.BooleanField(default=True)
    is_opened_to_marks = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'school', 'created_at']

    class Meta:
        unique_together = ['school', 'name']

    def __str__(self) -> str:
        return self.name


class Term(CustomModel):
    year = models.ForeignKey(
        to=Year,
        related_name="terms",
        on_delete=models.PROTECT,
        null=False,
    )
    name = models.CharField(max_length=255, blank=False)
    from_date = models.DateField(null=False, blank=False)
    to_date = models.DateField(null=False, blank=False)
    is_closed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    non_updatable_fields = ['id', 'year', 'created_at']

    class Meta:
        unique_together = ['year', 'name']

    def __str__(self) -> str:
        return "{} ({} - {})".format(self.name, self.from_date, self.to_date)
    
    @property
    def is_finished(self):
        return datetime.date.today() > self.to_date
    
    @property
    def is_opened_to_final_marks(self):
        return self.is_finished and not self.is_closed
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if self.to_date < self.from_date:
            errors.add_field_message('term', 'Term to_date must be greater than from_date')
            
        if errors:
            raise ValidationError(errors.map)
    
