from django.contrib import admin
from .models.product import (
    Product,
    ProductCategory,
    ProductPrice,
    PriceList,
    ProductBarcode,
    ProductUOM,
    ProductVariantAttribute,
)

admin.site.register(ProductCategory)
admin.site.register(PriceList)


class ProductAdmin(admin.ModelAdmin):
    class ProductBarcodeInline(admin.TabularInline):
        model = ProductBarcode
        extra = 0

    class ProductPriceInline(admin.TabularInline):
        model = ProductPrice
        extra = 0

    class ProductUOMInline(admin.TabularInline):
        model = ProductUOM
        extra = 0

    class ProductVariantAttributeInline(admin.TabularInline):
        model = ProductVariantAttribute
        extra = 0

    list_display = ("product_name", "category")
    search_fields = ("product_name", "category__name")
    inlines = [
        ProductPriceInline,
        ProductBarcodeInline,
        ProductUOMInline,
        ProductVariantAttributeInline,
    ]


admin.site.register(Product, ProductAdmin)
