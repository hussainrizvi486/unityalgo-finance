from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.views import APIView
from apps.stock.models import Product, ProductCategory


class ProductCategorySerializer(ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"


class ProductSerializer(ModelSerializer):
    category = ProductCategorySerializer()

    class Meta:
        model = Product
        fields = "__all__"


class ProductAPIView(APIView):
    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        print(products)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
