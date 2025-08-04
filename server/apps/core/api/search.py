from django.apps import apps
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response


class SearchLinkAPIView(APIView):
    def get(self, *args, **kwargs):
        model_name = self.request.GET.get("model")
        app = self.request.GET.get("app")
        search_fields = self.request.GET.get("fields", "id").split(",")
        search_query = self.request.GET.get("query", "").strip()

        if not model_name or not app:
            return Response(
                {
                    "error": "Missing required parameters.",
                    "parameters": ["model", "app"],
                },
                status=400,
            )

        try:
            model = apps.get_model(app_label=app, model_name=model_name)
        except LookupError:
            return Response(
                {"error": "Invalid model or app."},
                status=400,
            )

        query = Q()
        if search_query:
            for i in search_fields:
                query |= Q(**{f"{i}__icontains": search_query})

        results = model.objects.filter(query).values("id", *search_fields)[:100]

        data = [
            {"id": row.get("id"), **{key: row.get(key) for key in search_fields}}
            for row in results
        ]
        return Response(data, status=200)
