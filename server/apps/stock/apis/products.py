from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView
from apps.stock.models import Product, ProductCategory, ProductPrice, PriceList


class ProductCategorySerializer(ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["name", "parent", "id"]


class ProductSerializer(ModelSerializer):
    category = ProductCategorySerializer()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


class PriceListSerializer(ModelSerializer):
    class Meta:
        model = PriceList
        fields = "__all__"


class PriceListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        price_lists = PriceList.objects.all()
        serializer = PriceListSerializer(price_lists, many=True)
        return Response(serializer.data)


class ProductAPIView(APIView):
    def get(self, request, *args, **kwargs):
        from django.db.models import OuterRef, Subquery

        products = Product.objects.annotate(
            price=Subquery(
                ProductPrice.objects.filter(
                    product=OuterRef("id"),
                )
                .order_by("-created_at")
                .values("price")[:1]
            )
        )
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
