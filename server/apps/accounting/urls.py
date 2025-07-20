from django.urls import path
from .api.customer import CustomerAPIView

urlpatterns = [
    path("api/customer", CustomerAPIView.as_view(), name="customer-list"),
]
