from uuid import uuid4
from django.db import models


class BaseModel(models.Model):
    id = models.CharField(primary_key=True, default=uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
