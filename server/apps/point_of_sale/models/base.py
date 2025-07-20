from uuid import uuid4
from django.db import models
from apps.accounting.models.company import Company


class BaseModel(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Branch(models.Model):
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="branches", null=True, blank=True
    )
    branch_name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self, *args, **Kwargs):
        return self.branch_name
