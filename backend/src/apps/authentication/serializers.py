from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.core.modules.users import serializers as user_serializers
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["email"] = user.email
        token["role"] = user.role
        token["school_id"] = user.school_id
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token
