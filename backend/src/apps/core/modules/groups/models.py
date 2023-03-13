from django.db import models
from django.conf import settings

from apps.core.modules.posts.models import FeedMixin


class Group(FeedMixin):
    school = models.ForeignKey(
        to="schools.School",
        related_name="groups",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    teacher = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="supervised_groups",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    grade = models.ForeignKey(
        to="grades.Grade",
        related_name="groups",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    code = models.CharField(max_length=30, blank=False, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return "%s %s".format(self.grade, self.code)
