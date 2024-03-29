from rest_framework import serializers

from .models import Year, Term


class YearModelSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Year
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


class TermModelSerializer(serializers.ModelSerializer):
    is_finished = serializers.BooleanField(read_only=True)
    is_opened_to_final_marks = serializers.BooleanField(read_only=True)
      
    class Meta:
        model = Term
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at']


class TermModelNestedSerializer(TermModelSerializer):
    year = YearModelSerializer(read_only=True)


class TermModelCreateUpdateSerializer(TermModelSerializer):
    def to_representation(self, instance):
        serializer = TermModelNestedSerializer(instance)
        return serializer.data