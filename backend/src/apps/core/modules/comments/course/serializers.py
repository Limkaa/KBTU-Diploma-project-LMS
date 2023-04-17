from rest_framework import serializers

from ..models import CoursePostComment
from ...users.serializers import UserPublicSerializer


class CoursePostCommentModelSerializer(serializers.ModelSerializer):  
    user = UserPublicSerializer(read_only=True)
    
    class Meta:
        model = CoursePostComment
        fields = "__all__"
        read_only_fields = ["id", 'post', 'user', 'created_at', 'updated_at']