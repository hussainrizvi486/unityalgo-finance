from django.urls import path
from .api.profile import POSProfileAPIView

urlpatterns = [
    path(
        "api/pos/get-profile",
        POSProfileAPIView.as_view(),
    )
]
