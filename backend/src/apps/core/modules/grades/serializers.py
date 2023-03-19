from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import Grade


class GradeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    school_id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    is_active = serializers.BooleanField(required=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        validators = [
            UniqueTogetherValidator(
                queryset=Grade.objects.all(),
                fields=['school_id', 'name']
            )
        ]
        
    def create(self, validated_data):
        return Grade.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance