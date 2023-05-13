from .base import YearMarkModelSerializer, YearMarkNestedSerializer


class YearMarkCreateSerializer(YearMarkModelSerializer):
    class Meta(YearMarkModelSerializer.Meta):
        read_only_fields = ['last_edited_by', 'created_at']
    
    def to_representation(self, instance):
        return YearMarkNestedSerializer(instance).data


class YearMarkUpdateSerializer(YearMarkModelSerializer):
    class Meta(YearMarkModelSerializer.Meta):
        read_only_fields = ['enrollment', 'last_edited_by', 'created_at']
    
    def to_representation(self, instance):
        return YearMarkNestedSerializer(instance).data