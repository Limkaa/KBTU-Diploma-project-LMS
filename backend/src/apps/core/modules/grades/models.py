from django.db import models


class Grade(models.Model):
    number = models.SmallIntegerField(null=False, blank=False, unique=True)
    name = models.CharField(max_length=100, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return "%d".format(self.number)
