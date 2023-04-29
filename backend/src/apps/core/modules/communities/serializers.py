from rest_framework import serializers
from ..students.serializers import StudentModelSerializer, StudentModelNestedSerializer

from .models import Community, Membership


class CommunityModelSerializer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Community
        fields = "__all__"
        read_only_fields = Community.non_updatable_fields


class MembershipModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = "__all__"
        read_only_fields = Membership.non_updatable_fields    
    

class MembershipNestedSerializer(MembershipModelSerializer):
    student = StudentModelNestedSerializer(read_only=True)
    community = CommunityModelSerializer(read_only=True)


class MembershipCreateSerializer(MembershipModelSerializer):
    def to_representation(self, instance):
        return MembershipNestedSerializer(instance).data


class CommunityMemberSerializer(MembershipNestedSerializer):
    community = None


class StudentCommunitySerializer(MembershipNestedSerializer):
    student = None


__all__ = [
    'CommunityModelSerializer',
    'MembershipModelSerializer',
    'MembershipCreateSerializer',
    'MembershipNestedSerializer',
    'CommunityMemberSerializer',
    'StudentCommunitySerializer'
]