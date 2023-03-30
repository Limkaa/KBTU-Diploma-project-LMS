from django.db import models
from django.core.exceptions import ValidationError

from ..schools.models import School


class Year(models.Model):
    school = models.ForeignKey(
        to=School,
        related_name="years",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['school', 'name']

    def __str__(self) -> str:
        return self.name


class Term(models.Model):
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

    class Meta:
        unique_together = ['year', 'name']

    def __str__(self) -> str:
        return "{} ({} - {})".format(self.name, self.from_date, self.to_date)
    
    def clean(self) -> None:
        if self.to_date < self.from_date:
            raise ValidationError('Term to_date must be greater than from_date')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
