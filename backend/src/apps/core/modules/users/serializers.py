from rest_framework import serializers

from .models import User


class UserPublicSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.ChoiceField(choices=User.Role.choices)


class UserSerializer(UserPublicSerializer):
    password = serializers.CharField(write_only=True)
    school_id = serializers.IntegerField(read_only=True)
    gender = serializers.ChoiceField(choices=User.Gender.choices)
    date_of_birth = serializers.DateField()
    phone = serializers.CharField()
    telegram_id = serializers.CharField(write_only=True)
    rating = serializers.IntegerField(read_only=True)
    avatar = serializers.FileField(required=False, allow_null=True)
    is_active = serializers.BooleanField()
    updated_at = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
