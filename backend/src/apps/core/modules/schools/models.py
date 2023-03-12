from django.db import models

from ..posts.models import FeedMixin


class School(FeedMixin):
    name = models.CharField(max_length=250, blank=False)
    address = models.CharField(max_length=250, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
