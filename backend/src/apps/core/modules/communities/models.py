from django.db import models
from django.conf import settings


class CommunityCategory(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)

    class Meta:
        verbose_name = "Community category"
        verbose_name_plural = "Community categories"

    def __str__(self) -> str:
        return self.name


class Community(models.Model):
    school = models.ForeignKey(
        to="schools.School",
        related_name="communities",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    created_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="communities",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    category = models.ForeignKey(
        CommunityCategory,
        related_name="communities",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )

    name = models.CharField(max_length=250, blank=False, unique=True)
    description = models.TextField(blank=False)
    link = models.URLField(blank=True)
    is_moderated = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Community"
        verbose_name_plural = "Communities"

    def __str__(self) -> str:
        return self.name
