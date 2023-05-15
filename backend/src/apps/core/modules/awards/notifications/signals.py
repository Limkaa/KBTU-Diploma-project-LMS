from django.db.models.signals import post_save
from django.dispatch import receiver

from ..models import Winner
from ...students.models import Student

from .messages import NEW_AWARD
from apps.tgbot.tasks import broadcast_message


@receiver(post_save, sender=Winner)
def send_notification(sender, instance: Winner, created, **kwargs):
    if created:
        message = NEW_AWARD.format(
            award=instance.award.name,
            course=instance.course
        )
        broadcast_message.delay(text=message, user_ids=[instance.student.user.telegram_id])