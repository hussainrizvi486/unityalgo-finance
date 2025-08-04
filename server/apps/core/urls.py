from django.urls import path
from .api import SearchLinkAPIView

urlpatterns = [
    path("api/search-link/", SearchLinkAPIView.as_view(), name="search_link"),
]
