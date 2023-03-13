from django.db import models
from django.conf import settings


class Award(models.Model):
    name = models.CharField(max_length=250, blank=False, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class AwardWinner(models.Model):
    user = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return "%s awarded with %s".format(self.user, self.award)
