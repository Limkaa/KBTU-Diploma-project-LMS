from django.db.models.signals import post_save
from django.dispatch import receiver

from ..models import Assignment
from ...students.models import Student

from .messages import NEW_ASSIGNMENT
from apps.tgbot.tasks import broadcast_message


@receiver(post_save, sender=Assignment)
def add_rating_for_award(sender, instance: Assignment, created, **kwargs):
    # if created:
    message = NEW_ASSIGNMENT.format(
        subject=instance.course.subject,
        name=instance.name,
        datetime=instance.datetime.strftime('%Y-%m-%d %H:%m')
    )
    students_ids = Student.objects.filter(group=instance.course.group).exclude(user__telegram_id='').values_list('user__telegram_id', flat=True)
    broadcast_message.delay(text=message, user_ids=list(students_ids))