from rest_framework import serializers

from apps.core.utils.serializers import inline_serializer

from ..models import Timetable

from ..rooms.serializers import RoomModelSerializer
from ..timebounds.serializers import TimeboundModelSerializer
from ...courses.serializers import CourseModelNestedSerializer
from ...subjects.serializers import SubjectModelSerializer


class TimetableModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Timetable
        fields = "__all__"
        read_only_fields = ['school', 'room', 'timebound', 'weekday', 'created_at', 'updated_at']


class TimetableNestedSerializer(TimetableModelSerializer):
    room = RoomModelSerializer(read_only=True)
    timebound = TimeboundModelSerializer(read_only=True)
    course = CourseModelNestedSerializer(read_only=True)


class TimetableUpdateSerializer(TimetableModelSerializer):
    def to_representation(self, instance):
        return TimetableNestedSerializer(instance).data


class SchoolTimetableSerializer(serializers.Serializer):
    timebound = serializers.IntegerField()
    weekday = serializers.ChoiceField(choices=Timetable.Weekday)
    free_rooms_num = serializers.IntegerField()


class GroupTimetableSerializer(TimetableNestedSerializer):
    class CourseSerializer(CourseModelNestedSerializer):
        subject = SubjectModelSerializer()
        group = None
        
    course = CourseSerializer()


class TeacherTimetableSerializer(TimetableNestedSerializer):
    class CourseSerializer(CourseModelNestedSerializer):
        teacher = None
    
    course = CourseSerializer()



__all__ = [
    "TimetableModelSerializer",
    "TimetableNestedSerializer",
    "TimetableUpdateSerializer",
    "SchoolTimetableSerializer",
    "GroupTimetableSerializer",
    "TeacherTimetableSerializer"
]