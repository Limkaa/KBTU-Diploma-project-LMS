from django.db import models
from django.conf import settings


class Discussion(models.Model):
    is_opened = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class DiscussionMixin(models.Model):
    discussion = models.OneToOneField(
        to=Discussion,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )

    class Meta:
        abstract = True


class Comment(models.Model):
    created_by = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="comments",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    discussion = models.ForeignKey(
        to=Discussion,
        related_name="comments",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    text = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.text
