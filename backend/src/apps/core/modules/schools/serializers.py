from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import School


class SchoolSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        required=True, 
        max_length=School.NAME_MAX_LENGTH,
        validators=[UniqueValidator(queryset=School.objects.all())]
    )
    address = serializers.CharField(required=True, max_length=School.ADDRESS_MAX_LENGTH)
    description = serializers.CharField(allow_blank=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
    
    