from .base import EnrollmentModelSerializer
from .nested import EnrollmentNestedSerializer


class EnrollmentModelCreateSerializer(EnrollmentModelSerializer):
    class Meta(EnrollmentModelSerializer.Meta):
        read_only_fields = ['id', 'subject', 'year', 'course', 'created_at']
    
    def to_representation(self, instance):
        return EnrollmentNestedSerializer(instance).data


class EnrollmentModelUpdateSerializer(EnrollmentModelSerializer):
    class Meta(EnrollmentModelSerializer.Meta):
        read_only_fields = ['id', 'student', 'subject', 'year', 'course', 'created_at']
        
    def to_representation(self, instance):
        return EnrollmentNestedSerializer(instance).data