from rest_framework import serializers

from ..models import SchoolPost


class SchoolPostModelSerializer(serializers.ModelSerializer):  
    class Meta:
        model = SchoolPost
        fields = "__all__"
        read_only_fields = ['school', 'created_at', 'updated_at']



__all__ = [
    "SchoolPostModelSerializer",
]