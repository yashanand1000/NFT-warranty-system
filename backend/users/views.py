from users.models import Owner, Retailer
from users.serializers import (MyTokenObtainPairSerializer, OwnerSerializer, OwnerLoginSerializer, OwnerUpdateSerializer,
                               RegisterSerializer, RetailerUpdateSerializer)
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = Retailer.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class RetailerUpdateView(generics.UpdateAPIView):
    queryset = Retailer.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RetailerUpdateSerializer


@api_view(['POST'])
@permission_classes((AllowAny,))
def owner_login(request):
    serializer = OwnerLoginSerializer(data=request.data)

    try:
        request.data['wallet_address']
    except KeyError:
        return JsonResponse({'error': 'wallet_address is required'})

    if serializer.is_valid():
        try:
            owner = Owner.objects.get(wallet_address=serializer.validated_data['wallet_address'])
            return JsonResponse({'id': owner.id, 'name': owner.name, 'phno': owner.phno, 'wallet_address': owner.wallet_address})
        except Owner.DoesNotExist:
            return JsonResponse({'error': 'Owner does not exist'}, status=401)
    else:
        return JsonResponse(serializer.errors, status=400)


class OwnerRegisterView(generics.CreateAPIView):
    queryset = Owner.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = OwnerSerializer


class OwnerUpdateView(generics.UpdateAPIView):
    queryset = Owner.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = OwnerUpdateSerializer
