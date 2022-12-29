from django.db import models


class Product(models.Model):
    HOME = 'home'
    APPLIANCES = 'appliances'
    LAPTOP = 'laptop'
    MOBILE = 'mobile'
    GADGET = 'gadget'
    CATEGORY_CHOICES = (
        (HOME, 'Home'),
        (APPLIANCES, 'Appliances'),
        (LAPTOP, 'Laptop'),
        (MOBILE, 'Mobile'),
        (GADGET, 'Gadget'),
    )

    name = models.CharField(max_length=100)
    image = models.FileField(upload_to='products/')  # this would be the image or data that we tokenize
    product_data = models.CharField(max_length=500)  # optional data we want to store like product description etc
    retailer = models.ForeignKey('users.Retailer', on_delete=models.CASCADE)
    warranty_period = models.IntegerField(help_text="Enter the value in months")
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default=HOME)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    owner = models.ForeignKey('users.Owner', on_delete=models.SET_NULL, null=True)
    metadata_uri = models.CharField(max_length=100, blank=True)
    nft_id = models.CharField(max_length=100, blank=True)
    warranty_image = models.FileField(upload_to='items/', null=True, blank=True)
    serial_no = models.CharField(max_length=100)
    warranty_start_date = models.DateField(null=True, blank=True)
    warranty_end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    is_issued = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.serial_no}"


class Order(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="order")
    phno = models.CharField(max_length=10)
    name = models.CharField(max_length=100, blank=True)
    is_delivered = models.BooleanField(default=False)
    order_id = models.CharField(max_length=100, blank=True)
    to_address = models.CharField(max_length=500, blank=True)
    from_address = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.item.serial_no}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_delivered:
            self.item.is_issued = True
            self.item.save()
        if self.order_id == "":
            self.order_id = str(self.id) + 'x' + self.item.metadata_uri[-6:]
            self.save()
