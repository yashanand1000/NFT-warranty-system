from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, Item
from users.models import Owner
from .serializers import ProductSerializer, ItemSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from .utils import serialize_image
from django.core.files import File
from django.conf import settings
import os
from products.models import Order
from products.serializers import OrderSerializer
import datetime


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ('category',)
    search_fields = ('name',)
    permission_classes = [IsAuthenticated]


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ('product', 'warranty_end_date', 'is_issued')
    search_fields = ('serial_no', 'owner__name')

    def get_queryset(self):
        wallet_address = self.request.query_params.get('wallet_address', None)
        if wallet_address:
            return super().get_queryset().filter(owner__wallet_address=wallet_address)
        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        if request.query_params.get('serial_no'):
            item_serializer_no = request.query_params.get('serial_no')
            item = get_object_or_404(Item, serial_no=item_serializer_no)
            return Response(ItemSerializer(item).data)
        return super(ItemViewSet, self).list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        try:
            owner_data = validated_data.pop('owner')
            owner = Owner.objects.create(**owner_data)
        except KeyError:
            owner = None
        product = get_object_or_404(Product, id=data['product'])
        image = product.image.path
        item = Item.objects.create(owner=owner, product=product, **validated_data)
        ipfs_hash, image_url = serialize_image(image, validated_data['serial_no'], item)
        item.metadata_uri = ipfs_hash
        item.warranty_image = File(open(os.path.join(settings.MEDIA_ROOT, image_url), 'rb'), name=image_url.split('/')[-1])
        item.save()
        return Response(ItemSerializer(item).data)

    @action(detail=True, methods=['post'])
    def add_nft(self, request, pk=None):
        item = self.get_object()
        item.nft_id = request.data['nft_id']
        item.save()
        return Response(ItemSerializer(item).data, status=201)

    @action(detail=True, methods=['post'])
    def issue_user(self, request, pk=None):
        item = self.get_object()
        owner_data = request.data['owner']
        owner, _ = Owner.objects.get_or_create(**owner_data)
        item.owner = owner
        item.save()
        return Response(ItemSerializer(item).data, status=201)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ('is_delivered',)
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        phno = self.request.query_params.get('phno', None)
        if phno:
            return super().get_queryset().filter(phno=phno)
        return super().get_queryset()

    @action(detail=False, methods=['get'])
    def get_order(self, request):
        order_id = request.query_params.get('order_id', None)
        order = get_object_or_404(Order, order_id=order_id)
        return Response(OrderSerializer(order).data)

    @action(detail=False, methods=['get'])
    def claim_order(self, request):
        order_id = request.query_params.get('order_id', None)
        to_address = request.query_params.get('to_address', None)
        nft_id = request.query_params.get('nft_id', None)
        print(order_id, to_address, nft_id)
        if order_id:
            order = get_object_or_404(Order, order_id=order_id)
            item = order.item
            owner, created = Owner.objects.get_or_create(wallet_address=to_address)
            item.owner = owner
            if nft_id:
                item.nft_id = nft_id
            warranty_period = item.product.warranty_period
            delta = datetime.timedelta(days=warranty_period)
            item.warranty_end_date = datetime.date.today() + delta*30
            item.save()
            order.save()
            order.delete()
            return Response(OrderSerializer(order).data)
        return Response(status=400)
