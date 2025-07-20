from django.contrib.auth import get_user_model
from django.db import models
from .base import BaseModel
from .base import Branch
from apps.stock.models.product import PriceList
from apps.accounting.models.company import Company


class POSProfile(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="pos_profiles"
    )
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="pos_profiles",
        null=True,
        blank=True,
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="pos_profiles",
        null=True,
        blank=True,
    )
    price_list = models.ForeignKey(
        PriceList,
        on_delete=models.CASCADE,
        related_name="pos_profiles",
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "POS Profile"
        verbose_name_plural = "POS Profiles"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.company and not self.branch:
            self.company = self.branch.company
            
        super().save(*args, **kwargs)
