from rest_framework import serializers

from ....enrollments.serializers import EnrollmentNestedSerializer
from ....users.serializers import UserPublicSerializer
from ....terms.serializers import TermModelNestedSerializer

from ...models import TermMark


class TermMarkModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermMark
        fields = "__all__"
        read_only_fields = TermMark.non_updatable_fields
        

class TermMarkNestedSerializer(TermMarkModelSerializer):
    enrollment = EnrollmentNestedSerializer(read_only=True)
    term = TermModelNestedSerializer(read_only=True)
    last_edited_by = UserPublicSerializer(read_only=True)