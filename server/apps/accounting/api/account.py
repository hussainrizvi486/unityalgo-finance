from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.viewsets import ViewSet
from apps.accounting.models.accounts import Account


class AccountViewSerializer(serializers.ModelSerializer):
    childrens = serializers.SerializerMethodField()

    def get_childrens(self, account):
        return AccountViewSerializer(account.descendants.all(), many=True).data

    class Meta:
        model = Account
        fields = [
            "account_number",
            "account_name",
            "account_type",
            "id",
            "company",
            "frozen",
            "is_group",
            "childrens",
        ]


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"


class AccountViewSet(ViewSet):
    def tree(self, *args, **kwargs):
        root_nodes = Account.objects.filter(disabled=False).filter(parent=None)
        serializer = AccountViewSerializer(root_nodes, many=True)
        return Response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = AccountViewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.create()

            return Response(data=serializer.data, status=201)
        return Response(data=serializer.errors, status=400)
