import factory
from factory.fuzzy import FuzzyText
import random
import string


class RetailerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'users.Retailer'
        django_get_or_create = ('email', 'is_active')

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    is_staff = True
    is_active = True
    email = factory.Faker('email')


class OwnerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = 'users.Owner'
        django_get_or_create = ('phno', 'name', 'wallet_address')

    phno = random.randint(6000000000, 9999999999)
    name = factory.Faker('name')
    wallet_address = FuzzyText(length=40, prefix='0x', chars=string.ascii_lowercase + string.digits)
