from rest_framework import serializers

from ....enrollments.serializers import EnrollmentNestedSerializer
from ..terms_marks import TermMarkModelSerializer
from ..years_marks import YearMarkModelSerializer


class EnrollmentFinalMarksSerializer(EnrollmentNestedSerializer):
    terms_average = serializers.DecimalField(read_only=True, max_digits=3, decimal_places=2)
    terms_marks = TermMarkModelSerializer(read_only=True, many=True)
    year_mark = YearMarkModelSerializer(read_only=True, source="yearmark")