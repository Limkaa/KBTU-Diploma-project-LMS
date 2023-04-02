from rest_framework import serializers

from .models import Grade


class GradeModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Grade
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']