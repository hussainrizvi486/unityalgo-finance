from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

class POSInvoiceSerializer(ModelSerializer):
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