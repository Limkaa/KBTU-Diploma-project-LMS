from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from .models import Mark


@receiver(pre_save, sender=Mark)
def check_mark_changes(sender, instance, **kwargs):
    if instance.id is None:
        pass
    
    else:
        current = instance
        previous = Mark.objects.get(id=current.id)
        
        if previous.number != current.number:
            user = instance.enrollment.student.user
            user.rating -= previous.rating_points - current.rating_points
            user.save()


@receiver(post_save, sender=Mark)
def add_rating_for_mark(sender, instance: Mark, created, **kwargs):
    if created:
        user = instance.enrollment.student.user
        user.rating += instance.rating_points
        user.save()


@receiver(post_delete, sender=Mark)
def remove_rating_for_mark(sender, instance: Mark, **kwargs):
    user = instance.enrollment.student.user
    user.rating -= instance.rating_points
    user.save()
