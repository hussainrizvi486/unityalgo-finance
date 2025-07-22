from django.urls import path
from .api.profile import POSProfileAPIView
from .api.pos_invoice import POSInvoiceAPIView

urlpatterns = [
    path(
        "api/pos/get-profile",
        POSProfileAPIView.as_view(),
    ),
    path(
        "api/pos/create-invoice",
        POSInvoiceAPIView.as_view(),
    ),
    path("api/pos/invoice", POSInvoiceAPIView.as_view()),
]
