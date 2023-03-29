from django.db.models.signals import post_save
from django.dispatch import receiver

from ..users.models import User
from .models import Student

@receiver(post_save, sender=User)
def create_profile(sender, instance: User, created, **kwargs):
    if created and instance.role == User.Role.STUDENT:
        Student.objects.create(user=instance)