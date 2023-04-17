from rest_framework import serializers

from ..models import SchoolPostComment
from ...users.serializers import UserPublicSerializer


class SchoolPostCommentModelSerializer(serializers.ModelSerializer):  
    user = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = SchoolPostComment
        fields = "__all__"
        read_only_fields = ["id", 'post', 'user', 'created_at', 'updated_at']