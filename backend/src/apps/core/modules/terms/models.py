from django.db import models
from django.db.models.query import F, Q


class Cycle(models.Model):
    school = models.ForeignKey(
        to="schools.School",
        related_name="cycles",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Term(models.Model):
    cycle = models.ForeignKey(
        to=Cycle,
        related_name="terms",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=255, blank=False)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                name="school_term_start_before_end",
                check=Q(start_date__lt=F("end_date")),
            )
        ]

    def __str__(self) -> str:
        return "%s ({} - {})".format(self.name, self.start_date, self.end_date)
