import uuid
from django.db import models
from .company import Company


class RootAccountTypeChoices(models.TextChoices):
    ASSET = "asset", "Asset"
    LIABILITY = "liability", "Liability"
    EQUITY = "equity", "Equity"
    REVENUE = "revenue", "Revenue"
    EXPENSE = "expense", "Expense"


class AccountTypeChoices(models.TextChoices):
    ASSET = "asset", "Asset"
    LIABILITY = "liability", "Liability"
    EQUITY = "equity", "Equity"
    REVENUE = "revenue", "Revenue"
    EXPENSE = "expense", "Expense"


class Account(models.Model):
    id = models.CharField(max_length=99, primary_key=True, default=uuid.uuid4)
    account_number = models.CharField(max_length=255, blank=True, null=True)
    # root_type = models.CharField(
    #     max_length=50,
    #     choices=RootAccountTypeChoices.choices,
    # )
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
        related_name="sub_accounts",
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
        return f"{self.account_number or ''} {self.account_name}"

    # class Meta:
    #     managed = False
