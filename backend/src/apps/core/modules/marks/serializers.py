from rest_framework import serializers

from ..students.serializers import StudentModelNestedSerializer
from ..assignments.serializers import AssignmentModelNestedSerializer
from ..courses.serializers import CourseModelNestedSerializer

from .models import Mark


class MarkModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Mark
        fields = "__all__"
        read_only_fields = ['assignment', 'student', 'created_at', 'updated_at']


class MarkCreateModelSerializer(MarkModelSerializer):
    ''' Only for create method in order to provide student '''
    class Meta(MarkModelSerializer.Meta):
        read_only_fields = ['assignment', 'created_at', 'updated_at']


class MarkNestedSerializer(MarkModelSerializer):
    assignment = AssignmentModelNestedSerializer()
    student = StudentModelNestedSerializer()
    

class StudentMarksSerializer(StudentModelNestedSerializer):
    ''' For assignment related student marks '''
    group = None
    marks = MarkModelSerializer(many=True)
    
class StudentMarksOverviewSerializer(StudentMarksSerializer):
    average_mark = serializers.DecimalField(read_only=True, max_digits=3, decimal_places=2)


class StudentAssignmentMarks(AssignmentModelNestedSerializer):
    class CourseSerializer(CourseModelNestedSerializer):
        group=None
    
    course = CourseSerializer(read_only=True)
    marks = MarkModelSerializer(many=True)


__all__ = [
    "MarkModelSerializer",
    "MarkCreateModelSerializer",
    "MarkNestedSerializer",
    "StudentMarksSerializer",
    "StudentMarksOverviewSerializer",
    "StudentAssignmentMarks"
]