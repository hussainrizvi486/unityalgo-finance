from django.db import models
from .base import BaseModel


class CustomerGroup(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class Customer(BaseModel):
    customer_name = models.CharField(max_length=255)
    customer_type = models.CharField(
        max_length=50,
        choices=[
            ("individual", "Individual"),
            ("company", "Company"),
            ("partnership", "Partnership"),
        ],
    )
    customer_group = models.ForeignKey(
        CustomerGroup, on_delete=models.SET_NULL, null=True, blank=True
    )

    tax_id = models.CharField(max_length=50, blank=True, null=True)
    disabled = models.BooleanField(default=False)
    is_frozen = models.BooleanField(default=True)
    primary_address = models.CharField(max_length=255, blank=True, null=True)
    primary_contact = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.customer_name
