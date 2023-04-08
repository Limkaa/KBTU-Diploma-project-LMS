from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

from .models import Course


@receiver(pre_save, sender=Course)
def check_course_changes(sender, instance: Course, **kwargs):
    try:
        obj: Course = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        pass
    else:
        read_only_fields = Course.non_updatable_fields
        for field in read_only_fields:
            if getattr(obj, field) != getattr(instance, field):
                raise ValidationError(f'Fields {", ".join(read_only_fields)} cannot be changed after course creation')