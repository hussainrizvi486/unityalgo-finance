from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounting.models.customer import Customer, CustomerGroup


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["customer_name", "id"]


class CustomerAPIView(APIView):
    def get(self, request, *args, **kwargs):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)
