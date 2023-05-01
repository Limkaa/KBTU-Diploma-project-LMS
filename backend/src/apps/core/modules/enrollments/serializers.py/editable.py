from .base import EnrollmentModelSerializer
from .nested import EnrollmentNestedSerializer


class EnrollmentModelCreateSerializer(EnrollmentModelSerializer):
    class Meta(EnrollmentModelSerializer.Meta):
        read_only_fields = ['id', 'subject', 'year', 'created_at']


class EnrollmentModelUpdateSerializer(EnrollmentModelSerializer):
    def to_representation(self, instance):
        return EnrollmentNestedSerializer(instance).data