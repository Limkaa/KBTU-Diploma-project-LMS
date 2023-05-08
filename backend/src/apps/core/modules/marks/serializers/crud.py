from .base import MarkModelSerializer, MarkNestedSerializer


class MarkCreateModelSerializer(MarkModelSerializer):
    class Meta(MarkModelSerializer.Meta):
        read_only_fields = ['assignment', 'last_edited_by', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        return MarkNestedSerializer(instance).data


class MarkUpdateModelSerializer(MarkModelSerializer):
    class Meta(MarkModelSerializer.Meta):
        read_only_fields = ['assignment', 'enrollment', 'last_edited_by', 'created_at', 'updated_at']
        
    def to_representation(self, instance):
        return MarkNestedSerializer(instance).data