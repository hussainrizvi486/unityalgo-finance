from django.db import models
from .main import BaseModel


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
    main_stock = models.BooleanField(default=False)
    stock_uom = models.CharField(max_length=50, default="pcs")

    def __str__(self):
        return self.product_name
