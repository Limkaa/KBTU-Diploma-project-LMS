from django.db import models
from ...utils.models import CustomModel

from ..courses.models import Course
from ..schools.models import School


class Post(CustomModel):
    title = models.CharField(max_length=250, blank=False)
    text = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return self.title


class CoursePost(Post):
    course = models.ForeignKey(
        to=Course,
        related_name='posts',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    non_updatable_fields = ['id', 'course', 'created_at']


class SchoolPost(Post):
    school = models.ForeignKey(
        to=School,
        related_name='posts',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    non_updatable_fields = ['id', 'school', 'created_at']
