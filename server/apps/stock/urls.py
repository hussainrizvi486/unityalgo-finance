from django.urls import path
from .apis.products import ProductAPIView

urlpatterns = [
    path("api/products/", ProductAPIView.as_view(), name="product-list"),
]
