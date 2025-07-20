from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from apps.stock.models.product import ProductCategory


class CategoryListSerailizer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory


class CategoryAPIView(APIView):
    def get(self, *args, **kwargs):
        categories = ProductCategory.objects.all()
        serializer = CategoryListSerailizer(categories, many=True)
        return Response({"categories": serializer.data})
