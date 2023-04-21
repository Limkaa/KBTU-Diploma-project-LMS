import datetime

from django.db import models
from django.core.exceptions import ValidationError

from ...utils.models import CustomModel
from ...utils.exceptions import ResponseDetails

from ..schools.models import School
from ..courses.models import Course


class Room(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name='rooms',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    name = models.CharField(max_length=50, blank=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'school', 'created_at']
    
    class Meta:
        unique_together = ['school', 'name']

    def __str__(self) -> str:
        return self.name
    

class Timebound(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name='timebounds',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    from_time = models.TimeField(blank=False)
    to_time = models.TimeField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'school', 'created_at']
    
    class Meta:
        unique_together = ['school', 'from_time', 'to_time']
        ordering = ['from_time', 'to_time']

    def __str__(self) -> str:
        return f"{self.from_time} - {self.to_time}"
    
    def clean(self):
        errors = ResponseDetails()
        errors.clear()
        
        if self.to_time < self.from_time:
            errors.add_field_message('to_time', 'Value of to_time must be greater than from_time')
        
        if errors:
            raise ValidationError(errors.map)


class Timetable(CustomModel):
    school = models.ForeignKey(
        to=School,
        related_name='timetable',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    course = models.ForeignKey(
        to=Course,
        related_name='timetable',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    room = models.ForeignKey(
        to=Room,
        related_name='timetable',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    timebound = models.ForeignKey(
        to=Timebound,
        related_name='timetable',
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    
    class Weekday(models.IntegerChoices):
        MONDAY = 1, "Monday"
        TUESDAY = 2, "Tuesday"
        WEDNESDAY = 3, "Wednesday"
        THURSDAY = 4, "Thursday"
        FRIDAY = 5, "Friday"
        SATURDAY = 6, "Saturday"
        SUNDAY = 0, "Sunday"

    weekday = models.PositiveSmallIntegerField(blank=False, choices=Weekday.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'school', 'room', 'timebound', 'weekday', 'created_at']
    
    class Meta:
        unique_together = ['timebound', 'room', 'weekday']
        ordering = ['weekday', 'timebound']

    def __str__(self) -> str:
        return f"weekday {self.weekday}, {self.timebound}, room {self.room}"
    
    def clean(self):
        errors = ResponseDetails()
        errors.clear()
        
        def check_same_school(object, key: str):
            if object.school != self.school:
                message = "Specified object must belong to same school"
                errors.add_field_message(key, message)
        
        if self.course:
            check_same_school(self.course, 'course')
            
            if Timetable.objects.filter(timebound=self.timebound, weekday=self.weekday, course=self.course).exists():
                errors.add_field_message('course', 'This course already has lesson at that time and weekday')
        
        check_same_school(self.room, 'room')
        check_same_school(self.timebound, 'timebound')
        
        if errors:
            raise ValidationError(errors.map)

