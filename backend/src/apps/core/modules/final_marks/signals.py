from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver

from .models import TermMark, YearMark


@receiver(pre_save, sender=TermMark)
def check_term_mark_changes(sender, instance, **kwargs):
    if instance.id is None:
        pass
    
    else:
        current = instance
        previous = TermMark.objects.get(id=current.id)
        
        if previous.number != current.number:
            user = instance.enrollment.student.user
            user.rating -= previous.rating_points - current.rating_points
            user.save()


@receiver(post_save, sender=TermMark)
def add_rating_for_term_mark(sender, instance: TermMark, created, **kwargs):
    if created:
        user = instance.enrollment.student.user
        user.rating += instance.rating_points
        user.save()


@receiver(post_delete, sender=TermMark)
def remove_rating_for_term_mark(sender, instance: TermMark, **kwargs):
    user = instance.enrollment.student.user
    user.rating -= instance.rating_points
    user.save()


@receiver(pre_save, sender=YearMark)
def check_year_mark_changes(sender, instance, **kwargs):
    if instance.id is None:
        pass
    
    else:
        current = instance
        previous = YearMark.objects.get(id=current.id)
        
        if previous.number != current.number:
            user = instance.enrollment.student.user
            user.rating -= previous.rating_points - current.rating_points
            user.save()


@receiver(post_save, sender=YearMark)
def add_rating_for_year_mark(sender, instance: YearMark, created, **kwargs):
    if created:
        user = instance.enrollment.student.user
        user.rating += instance.rating_points
        user.save()


@receiver(post_delete, sender=YearMark)
def remove_rating_for_year_mark(sender, instance: YearMark, **kwargs):
    user = instance.enrollment.student.user
    user.rating -= instance.rating_points
    user.save()