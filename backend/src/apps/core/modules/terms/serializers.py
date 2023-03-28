from rest_framework import serializers

from .models import Year


class YearModelSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Year
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']