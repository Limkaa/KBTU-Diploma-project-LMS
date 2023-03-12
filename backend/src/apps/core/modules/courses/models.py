from django.db import models
from django.conf import settings

from apps.core.modules.posts.models import FeedMixin


class Course(FeedMixin):
    school = models.ForeignKey(
        to="schools.School",
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    cycle = models.ForeignKey(
        to="terms.Cycle",
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    teacher = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        related_name="courses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    group = models.ForeignKey(
        to="groups.Group",
        related_name="courses",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    subject = models.ForeignKey(
        to="subjects.Subject",
        related_name="courses",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    files_folder = models.OneToOneField(
        to="files.Folder",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["group", "subject"]

    def __str__(self) -> str:
        return "%s".format(self.subject)
