from django.contrib import admin
from .models import Product, Item, Order

admin.site.register([Product, Item, Order])
