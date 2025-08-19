from uuid import uuid4
from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )

    class Meta:
        abstract = True
