from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models.profile import POSProfile
from apps.stock.models import PriceList


class PriceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceList
        fields = [
            "id",
            "buying",
            "name",
            "currency",
            "selling",
            "disabled",
        ]


class POSProfileSerializer(serializers.ModelSerializer):
    price_list = PriceListSerializer()

    class Meta:
        model = POSProfile
        fields = [
            "id",
            "branch",
            "company",
            "price_list",
            "name",
            "user",
        ]


class POSProfileAPIView(APIView):
    def get(self, request, *args, **kwargs):
        profile = POSProfile.objects.all().first()
        serializer = POSProfileSerializer(profile)

        return Response(data=serializer.data)
