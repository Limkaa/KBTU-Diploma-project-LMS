from rest_framework import serializers

from .models import Syllabus


class SyllabusModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Syllabus
        fields = "__all__"
        read_only_fields = ['course', 'created_at', 'updated_at']