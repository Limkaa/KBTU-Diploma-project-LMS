from django.db import models


class Subject(models.Model):
    school = models.ForeignKey(
        to="schools.School",
        related_name="subjects",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    grade = models.ForeignKey(
        to="grades.Grade",
        related_name="subjects",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    name = models.CharField(max_length=250, blank=False)
    code = models.CharField(max_length=30, blank=False, unique=True)
    description = models.TextField(blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return "%s %s".format(self.code, self.name)
