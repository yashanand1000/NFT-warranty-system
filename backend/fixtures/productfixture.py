import factory
import factory.fuzzy
import random
from users.models import Retailer
from products.models import Product
from datetime import datetime

CATEGORY_CHOICES = ['home', 'appliances', 'laptop', 'mobile', 'gadget']

COLOUR = ["orange", '#084594', '#2171b5', '#4292c6', '#6baed6', '#9ecae1',
          '#c6dbef', '#deebf7', '#f7fbff']


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'products.Product'
        django_get_or_create = ('name', 'image', 'product_data', 'retailer', 'category')

    name = factory.Faker('sentence', nb_words=3)
    image = factory.django.ImageField(color=random.choice(COLOUR))
    warranty_period = factory.fuzzy.FuzzyInteger(3, 60)
    product_data = factory.Faker('sentence', nb_words=10)
    retailer = factory.Iterator(Retailer.objects.all())
    category = factory.fuzzy.FuzzyChoice(CATEGORY_CHOICES)


class ItemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'products.Item'
        django_get_or_create = ('product', 'metadata_uri', 'nft_id', 'warranty_image', 'serial_no', 'warranty_start_date',
                                'warranty_end_date', 'is_issued', 'created_at', 'updated_at')

    product = factory.Iterator(Product.objects.all())
    metadata_uri = factory.Faker('uuid4')
    nft_id = factory.Faker('uuid4')
    warranty_image = factory.django.ImageField(color=factory.fuzzy.FuzzyChoice(COLOUR))
    serial_no = factory.Faker('uuid4')
    warranty_start_date = factory.Faker('date_time_this_year')
    warranty_end_date = factory.Faker('date_time_this_year')
    is_issued = factory.fuzzy.FuzzyChoice([True, False])
    created_at = datetime.now()
    updated_at = datetime.now()
