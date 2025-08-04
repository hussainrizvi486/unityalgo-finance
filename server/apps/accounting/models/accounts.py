from django.db import models
from .company import Company


class AccountTypeChoices(models.TextChoices):
    ASSET = "asset", "Asset"
    LIABILITY = "liability", "Liability"
    EQUITY = "equity", "Equity"
    REVENUE = "revenue", "Revenue"
    EXPENSE = "expense", "Expense"


class Account(models.Model):
    account_number = models.CharField(max_length=255, unique=True)
    account_name = models.CharField(max_length=255)
    account_type = models.CharField(
        max_length=50,
        choices=AccountTypeChoices.choices,
        default=AccountTypeChoices.ASSET,
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="descendants",
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="accounts"
    )
    tax_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=0, blank=True, null=True
    )
    is_group = models.BooleanField(default=False)
    frozen = models.BooleanField(default=False)
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"
