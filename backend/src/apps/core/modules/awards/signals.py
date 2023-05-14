from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Winner


@receiver(post_save, sender=Winner)
def add_rating_for_award(sender, instance: Winner, created, **kwargs):
    if created:
        user = instance.student.user
        user.rating += instance.award.points
        user.save()