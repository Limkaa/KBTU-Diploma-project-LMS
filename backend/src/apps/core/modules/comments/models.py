from django.db import models
from ...utils.models import CustomModel

from ..posts.models import CoursePost, SchoolPost
from ..users.models import User


class BasicComment(CustomModel):
    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )
    text = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'user', 'post', 'created_at']

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return self.text


class SchoolPostComment(BasicComment):
    post = models.ForeignKey(
        to=SchoolPost,
        related_name="comments",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )


class CoursePostComment(BasicComment):
    post = models.ForeignKey(
        to=CoursePost,
        related_name="comments",
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )