from rest_framework import serializers

from ..models import CoursePost


class CoursePostModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = CoursePost
        fields = "__all__"
        read_only_fields = ['course', 'created_at', 'updated_at']



__all__ = [
    "CoursePostModelSerializer",
]