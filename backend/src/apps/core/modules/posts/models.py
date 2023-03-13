from django.db import models

from apps.core.modules.comments.models import DiscussionMixin


class Feed(models.Model):
    is_opened = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FeedMixin(models.Model):
    feed = models.OneToOneField(
        to=Feed,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    class Meta:
        abstract = True


class Post(DiscussionMixin):
    title = models.CharField(max_length=250, blank=False)
    text = models.TextField(blank=False)

    feed = models.ForeignKey(
        to=Feed,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
