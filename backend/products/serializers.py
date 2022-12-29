from rest_framework import serializers
from .models import Order, Product, Item


class ProductSerializer(serializers.ModelSerializer):
    get_items_bool = True
    retailer_name = serializers.SerializerMethodField()
    retailer_id = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        self.get_items_bool = kwargs.pop('get_items', True)
        super().__init__(*args, **kwargs)

    def get_retailer_name(self, obj):
        return obj.retailer.first_name + " " + obj.retailer.last_name

    def get_retailer_id(self, obj):
        return obj.retailer.id

    def get_items(self, obj):
        queryset = Item.objects.filter(product=obj)
        if len(queryset) > 0:
            if self.get_items_bool:
                return ItemSerializer(queryset, many=True).data
        return None


class ItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    order_id = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ('id', 'serial_no', 'order_id', 'nft_id', 'metadata_uri', 'warranty_end_date', 'product',
                  'warranty_image', 'created_at', 'updated_at', 'owner', 'is_issued')
        read_only_fields = ('created_at', 'updated_at')

    def get_product(self, obj):
        return ProductSerializer(obj.product, get_items=False).data

    def get_order_id(self, obj):
        if obj.order.exists():
            return obj.order.first().order_id


class UpdateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class OrderSerializer(serializers.ModelSerializer):
    item_data = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = "__all__"

    def validate(self, attrs):
        super().validate(attrs)
        if Order.objects.filter(item=attrs['item']).exists():
            raise serializers.ValidationError("Product has been already transferred to other number")
        item = attrs.get('item')
        item.is_issued = True
        item.save()
        return attrs

    def get_item_data(self, obj):
        return ItemSerializer(obj.item).data
