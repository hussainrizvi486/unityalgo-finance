from django.urls import path
from .api.customer import CustomerAPIView
from .api.account import AccountsViewSet

urlpatterns = [
    path("api/customer", CustomerAPIView.as_view(), name="customer-list"),
    path("api/accounts/tree", AccountsViewSet.as_view({"get": "tree"}), name="account-tree"),
]
