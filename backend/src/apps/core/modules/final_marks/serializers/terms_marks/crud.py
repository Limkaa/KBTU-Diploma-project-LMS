from .base import TermMarkModelSerializer, TermMarkNestedSerializer


class TermMarkCreateSerializer(TermMarkModelSerializer):
    class Meta(TermMarkModelSerializer.Meta):
        read_only_fields = ['course', 'last_edited_by', 'created_at']
    
    def to_representation(self, instance):
        return TermMarkNestedSerializer(instance).data


class TermMarkUpdateSerializer(TermMarkModelSerializer):
    class Meta(TermMarkModelSerializer.Meta):
        read_only_fields = ['enrollment', 'course', 'term', 'last_edited_by', 'created_at']
    
    def to_representation(self, instance):
        return TermMarkNestedSerializer(instance).data