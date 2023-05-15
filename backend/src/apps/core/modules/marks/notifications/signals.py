from django.db.models.signals import post_save
from django.dispatch import receiver

from ..models import Mark
from ...students.models import Student

from .messages import NEW_MARK
from apps.tgbot.tasks import broadcast_message


@receiver(post_save, sender=Mark)
def send_notification(sender, instance: Mark, created, **kwargs):
    if created:
        message = NEW_MARK.format(
            mark=instance.number,
            course=instance.enrollment.course,
            assignment=instance.assignment
        )
        broadcast_message.delay(text=message, user_ids=[instance.enrollment.student.user.telegram_id])