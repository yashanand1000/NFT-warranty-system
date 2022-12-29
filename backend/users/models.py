from django.db import models
from django.contrib.auth.models import AbstractUser
from users.managers import CustomUserManager


class Owner(models.Model):
    phno = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, blank=True)
    wallet_address = models.CharField(max_length=250, blank=True)

    def __str__(self):
        return self.wallet_address


class Retailer(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.first_name + " " + self.last_name

    class Meta:
        verbose_name = "Retailer"
