from django.db import models
from .base import BaseTreeModel


class Account(models.Model):
    account_number = models.CharField(max_length=255, unique=True)
    account_name = models.CharField(max_length=255)
    account_type = models.CharField(
        max_length=50,
        choices=[
            ("asset", "Asset"),
            ("liability", "Liability"),
            ("equity", "Equity"),
            ("revenue", "Revenue"),
            ("expense", "Expense"),
        ],
        default="asset",
    )
    parent_account = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="sub_accounts",
    )
    company = models.ForeignKey(
        "Company", on_delete=models.CASCADE, related_name="accounts"
    )

    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0, blank=True, null=True
    )
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"
