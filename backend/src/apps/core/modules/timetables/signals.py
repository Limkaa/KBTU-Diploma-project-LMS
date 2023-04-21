from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Room, Timebound, Timetable


@receiver(post_save, sender=Room)
def create_timetabless_for_room(sender, instance: Room, created, **kwargs):
    if created:
        timetables: list[Timetable] = []
        
        for weekday in Timetable.Weekday.values:
            for timebound in Timebound.objects.filter(school=instance.school):
                timetables.append(Timetable(
                    timebound=timebound,
                    weekday=weekday,
                    room=instance,
                    school=instance.school
                ))
        Timetable.objects.bulk_create(timetables)


@receiver(post_save, sender=Timebound)
def create_timetabless_for_timebound(sender, instance: Timebound, created, **kwargs):
    if created:
        timetables: list[Timetable] = []
        
        for weekday in Timetable.Weekday.values:
            for room in Room.objects.filter(school=instance.school):
                timetables.append(Timetable(
                    timebound=instance,
                    weekday=weekday,
                    room=room,
                    school=instance.school
                ))
        Timetable.objects.bulk_create(timetables)