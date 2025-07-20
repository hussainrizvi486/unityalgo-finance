from django.db import models
from django.utils import timezone
from .main import BaseModel


class UOM(models.Model):
    name = models.CharField(max_length=50, unique=True, primary_key=True)
    description = models.CharField(blank=True, null=True, max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Units of Measure"
        ordering = ["name"]


class ProductCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="subcategories",
    )
    description = models.TextField(blank=True, null=True)

    def __str__(self, *args, **kwargs):
        return self.name

    class Meta:
        verbose_name_plural = "Product Categories"


class Product(BaseModel):
    sku = models.CharField(max_length=100, unique=True)
    product_name = models.CharField(max_length=999)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        related_name="products",
        blank=True,
        null=True,
    )
    maintain_stock = models.BooleanField(default=False)
    stock_uom = models.ForeignKey(UOM, on_delete=models.SET_NULL, blank=True, null=True)
    cover_image = models.ImageField(
        upload_to="product_images/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.product_name


class ProductBarcode(BaseModel):
    product = models.ForeignKey(
        "Product",
        on_delete=models.CASCADE,
        related_name="barcodes",
    )
    barcode = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return f"{self.product.product_name} - {self.barcode}"


class ProductVariantAttribute(BaseModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variant_attributes",
    )

    attribute = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.attribute}: {self.value} ({self.product.product_name})"


class ProductUOM(BaseModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="uoms",
    )
    uom = models.ForeignKey(
        UOM,
        on_delete=models.CASCADE,
        related_name="product_uoms",
    )
    conversion_factor = models.DecimalField(
        max_digits=10, decimal_places=4, default=1.0
    )

    def __str__(self):
        return (
            f"{self.product.product_name} - {self.uom.name} ({self.conversion_factor})"
        )


class PriceList(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    buying = models.BooleanField(default=False)
    selling = models.BooleanField(default=True)
    currency = models.CharField(max_length=10, default="USD")
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class ProductPrice(BaseModel):
    price_list = models.ForeignKey(
        PriceList,
        on_delete=models.CASCADE,
        related_name="product_prices",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="prices",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)

    buying = models.BooleanField(default=False)
    selling = models.BooleanField(default=True)

    valid_from = models.DateField(blank=True, null=True)
    valid_to = models.DateField(blank=True, null=True)

    @property
    def is_valid(self):
        if not self.valid_from and not self.valid_to:
            return True

        if not self.valid_from and self.valid_to:
            return timezone.now().date() <= self.valid_to

        if self.valid_from and self.valid_to:
            return self.valid_from <= timezone.now().date() <= self.valid_to

        return False
