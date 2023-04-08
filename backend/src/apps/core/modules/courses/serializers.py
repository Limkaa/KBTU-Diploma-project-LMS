from rest_framework import serializers

from .models import Course

from ..users.serializers import UserPublicSerializer
from ..subjects.serializers import SubjectModelNestedSerializer
from ..terms.serializers import YearModelSerializer
from ..groups.serializers import GroupModelReadOnlySerializer


class CourseModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ['school', 'created_at', 'updated_at']


class CourseModelNestedSerializer(CourseModelSerializer):
    subject = SubjectModelNestedSerializer(read_only=True)
    year = YearModelSerializer(read_only=True)
    teacher = UserPublicSerializer(read_only=True)
    group = GroupModelReadOnlySerializer(read_only=True)


class UpdateCourseSerializer(CourseModelSerializer):
    class Meta(CourseModelSerializer.Meta):
        read_only_fields = ['created_at', 'updated_at', 'subject', 'school', 'group', 'year']
    
    def to_representation(self, instance):
        serializer = CourseModelNestedSerializer(instance)
        return serializer.data

class CreateCourseSerializer(CourseModelSerializer):
    def to_representation(self, instance):
        serializer = CourseModelNestedSerializer(instance)
        return serializer.data