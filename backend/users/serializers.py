from rest_framework import serializers
from users.models import Retailer
from .models import Owner
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Retailer
        fields = ('first_name', 'last_name', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Retailer.objects.create(
            email=validated_data['email'], first_name=validated_data['first_name'], last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class RetailerUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retailer
        fields = ('first_name', 'last_name', 'email')


class OwnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owner
        fields = ['phno', 'name', 'wallet_address', 'id']


class OwnerLoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owner
        fields = ['wallet_address']


class OwnerUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Owner
        fields = ['name', 'phno']
