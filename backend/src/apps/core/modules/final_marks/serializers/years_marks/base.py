from rest_framework import serializers

from ....enrollments.serializers import EnrollmentNestedSerializer
from ....users.serializers import UserPublicSerializer

from ...models import YearMark


class YearMarkModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearMark
        fields = "__all__"
        read_only_fields = YearMark.non_updatable_fields
        

class YearMarkNestedSerializer(YearMarkModelSerializer):
    enrollment = EnrollmentNestedSerializer(read_only=True)
    last_edited_by = UserPublicSerializer(read_only=True)