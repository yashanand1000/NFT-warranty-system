from django.contrib import admin
from .models import Retailer, Owner

admin.site.register([Retailer, Owner])
