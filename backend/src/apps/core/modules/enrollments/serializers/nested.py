from rest_framework import serializers

from ...terms.serializers import YearModelSerializer
from ...students.serializers import (
    StudentModelNestedSerializer
)
from ...subjects.serializers import (
    SubjectModelNestedSerializer
)
from ...courses.serializers import (
    CourseModelSerializer
)

from .base import EnrollmentModelSerializer


class EnrollmentNestedSerializer(EnrollmentModelSerializer):
    student = StudentModelNestedSerializer(read_only=True)
    subject = SubjectModelNestedSerializer(read_only=True)
    year = YearModelSerializer(read_only=True)
    course = CourseModelSerializer(read_only=True)