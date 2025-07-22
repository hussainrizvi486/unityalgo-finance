from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from ..models.invoice import POSInvoice, POSInvoiceItem


class POSInvoiceItemSerializer(ModelSerializer):
    class Meta:
        model = POSInvoiceItem
        fields = [
            "product",
            "quantity",
            "price",
            # "price_list",
        ]


class POSInvoiceListSerializer(ModelSerializer):
    class Meta:
        model = POSInvoice
        fields = [
            "id",
            "invoice_no",
            "customer",
            "posting_date",
            "grand_total",
        ]


class POSInvoiceViewSet(viewsets.ViewSet):
    def list(self, *args, **kwargs):
        queryset = POSInvoice.objects.all()
        serializer = POSInvoiceListSerializer(queryset, many=True)
        return Response(serializer.data)


class POSInvoiceSerializer(ModelSerializer):
    items = POSInvoiceItemSerializer(many=True)

    class Meta:
        model = POSInvoice
        fields = [
            "pos_profile",
            "customer",
            "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        invoice = POSInvoice.objects.create(**validated_data)
        for item_data in items_data:
            POSInvoiceItem.objects.create(invoice=invoice, **item_data)

        return invoice


class POSInvoiceAPIView(APIView):
    def post(self, *args, **kwargs):
        serializer = POSInvoiceSerializer(data=self.request.data)
        if serializer.is_valid():
            invoice = serializer.save()
            return Response({"status": "success", "invoice_id": invoice.id}, status=201)
        return Response(serializer.errors, status=400)

    def get(self, *args, **kwargs):
        id = self.request.GET.get("id")
        if not id:
            return Response({"error": "Invoice ID is required"}, status=400)

        try:
            invoice = POSInvoice.objects.get(id=id)
        except POSInvoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=404)

        serializer = POSInvoiceDetailSerializer(invoice)
        return Response(serializer.data, status=200)


class POSInvoiceDetailSerializer(ModelSerializer):
    class ItemSerializer(ModelSerializer):
        class Meta:
            model = POSInvoiceItem
            fields = [
                "product",
                "quantity",
                "price",
                "amount",
                "net_price",
                "net_amount",
                "discount_amount",
                "id",
            ]

    items = ItemSerializer(many=True)

    class Meta:
        model = POSInvoice
        fields = [
            "id",
            "invoice_no",
            "pos_profile",
            "customer",
            "items",
            "total_amount",
            "total_quantity",
            "grand_total",
            "discount_amount",
            "discount_percentage",
        ]
