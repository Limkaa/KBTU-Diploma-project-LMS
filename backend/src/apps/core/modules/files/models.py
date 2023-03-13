from django.db import models


class Folder(models.Model):
    parent = models.ForeignKey(
        to="self",
        related_name="subfolders",
        on_delete=models.PROTECT,
        blank=True,
        null=True,
    )
    name = models.CharField(max_length=250, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Material(models.Model):
    link = models.URLField(null=False, blank=False)
    name = models.CharField(max_length=250, blank=False)
    folder = models.ForeignKey(
        to=Folder,
        related_name="materials",
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
