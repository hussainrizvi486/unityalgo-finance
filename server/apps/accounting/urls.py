from django.urls import path
from .api.customer import CustomerAPIView
from .api.account import AccountViewSet

urlpatterns = [
    path("api/customer", CustomerAPIView.as_view(), name="customer-list"),
    path(
        "api/account/tree", AccountViewSet.as_view({"get": "tree"}), name="account-list"
    ),
    path(
        "api/account/add", AccountViewSet.as_view({"post": "create"}), name="account-add"
    ),
]
