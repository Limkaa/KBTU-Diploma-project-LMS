from django.db import models


class School(models.Model):
    NAME_MAX_LENGTH = 250
    ADDRESS_MAX_LENGTH = 250
    
    name = models.CharField(max_length=NAME_MAX_LENGTH, blank=False, unique=True)
    address = models.CharField(max_length=ADDRESS_MAX_LENGTH, blank=False)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
