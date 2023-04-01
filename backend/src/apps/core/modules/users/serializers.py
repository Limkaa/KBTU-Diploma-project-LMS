from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    school_id = serializers.IntegerField(read_only=True)
    role = serializers.ChoiceField(read_only=True, choices=User.Role.choices)
    avatar = serializers.ImageField(required=False, allow_null=True)
    gender = serializers.ChoiceField(required=True, choices=User.Gender.choices)
    date_of_birth = serializers.DateField(required=True)
    rating = serializers.IntegerField(read_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    telegram_id = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(required=False)
    updated_at = serializers.DateTimeField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class UserPublicSerializer(UserSerializer):
    date_of_birth = None
    phone = None
    telegram_id = None
    is_active = None
    updated_at = None
    date_joined = None


class UserCreateSerializer(UserSerializer):
    password = serializers.CharField(required=True, write_only=True)
    role = serializers.ChoiceField(required=True, choices=User.Role.choices)
    
    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user