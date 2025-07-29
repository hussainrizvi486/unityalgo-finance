from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers

from apps.accounting.models.accounts import Account


class AccountTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = "__all__"

    def get_children(self, obj):
        childrens = obj.sub_accounts.all()
        return AccountTreeSerializer(childrens, many=True).data


class AccountsViewSet(ViewSet):
    def tree(self, *args, **kwargs):
        accounts = Account.objects.filter(parent=None)
        serializer = AccountTreeSerializer(accounts, many=True)
        return Response(serializer.data)
