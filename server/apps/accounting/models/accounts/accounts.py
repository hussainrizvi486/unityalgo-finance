from uuid import uuid4
from django.db import models
from ..company import Company


class AccountType(models.TextChoices):
    ACCUMULATED_DEPRECIATION = "accumulated_depreciation", "Accumulated Depreciation"
    ASSET_RECEIVED_NOT_BILLED = (
        "asset_received_not_billed",
        "Asset Received But Not Billed",
    )
    BANK = "bank", "Bank"
    CASH = "cash", "Cash"
    CHARGEABLE = "chargeable", "Chargeable"
    CAPITAL_WORK_IN_PROGRESS = "capital_work_in_progress", "Capital Work in Progress"
    COST_OF_GOODS_SOLD = "cost_of_goods_sold", "Cost of Goods Sold"
    CURRENT_ASSET = "current_asset", "Current Asset"
    CURRENT_LIABILITY = "current_liability", "Current Liability"
    DEPRECIATION = "depreciation", "Depreciation"
    DIRECT_EXPENSE = "direct_expense", "Direct Expense"
    DIRECT_INCOME = "direct_income", "Direct Income"
    EQUITY = "equity", "Equity"
    EXPENSE_ACCOUNT = "expense_account", "Expense Account"
    EXPENSES_IN_ASSET_VALUATION = (
        "expenses_in_asset_valuation",
        "Expenses Included In Asset Valuation",
    )
    EXPENSES_IN_VALUATION = "expenses_in_valuation", "Expenses Included In Valuation"
    FIXED_ASSET = "fixed_asset", "Fixed Asset"
    INCOME_ACCOUNT = "income_account", "Income Account"
    INDIRECT_EXPENSE = "indirect_expense", "Indirect Expense"
    INDIRECT_INCOME = "indirect_income", "Indirect Income"
    LIABILITY = "liability", "Liability"
    PAYABLE = "payable", "Payable"
    RECEIVABLE = "receivable", "Receivable"
    ROUND_OFF = "round_off", "Round Off"
    ROUND_OFF_OPENING = "round_off_opening", "Round Off for Opening"
    STOCK = "stock", "Stock"
    STOCK_ADJUSTMENT = "stock_adjustment", "Stock Adjustment"
    STOCK_RECEIVED_NOT_BILLED = (
        "stock_received_not_billed",
        "Stock Received But Not Billed",
    )
    SERVICE_RECEIVED_NOT_BILLED = (
        "service_received_not_billed",
        "Service Received But Not Billed",
    )
    TAX = "tax", "Tax"
    TEMPORARY = "temporary", "Temporary"


class RootAccountType(models.TextChoices):
    ASSET = "asset", "Asset"
    LIABILITY = "liability", "Liability"
    EQUITY = "equity", "Equity"
    REVENUE = "revenue", "Revenue"
    EXPENSE = "expense", "Expense"


class Account(models.Model):
    id = models.CharField(default=uuid4, unique=True, primary_key=True, editable=False)
    account_number = models.CharField(max_length=255, unique=True)
    account_name = models.CharField(max_length=255)
    root_type = models.CharField(max_length=50, choices=RootAccountType.choices)
    account_type = models.CharField(max_length=50, choices=AccountType.choices)
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
    account_currency = models.CharField(null=True)
    frozen = models.BooleanField(default=False)
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.account_number} - {self.account_name}"

    def save(self, *args, **kwargs):
        self.validate_parent()
        self.validate_parent_child_account_type()
        self.validate_account_number()
        super().save(*args, **kwargs)

    def validate_parent_child_account_type(self): ...

    def validate_parent(self): ...

    def validate_account_currency(self):
        self.currency_explicitly_specified = True

        if not self.account_currency:
            self.account_currency = self.company.default_currency

        # gl_entry = GLEntry.objects.filter(account=self).first()
        # if gl_entry.currency and self.account_currency != gl_entry.currency:
        # raise Error("Currency can not be changed after making entries using some other currency")

    def validate_account_number(self):
        if not self.account_number:
            return

        existed_account = Account.objects.filter(
            account_number=self.account_number
        ).exclude(id=self.id)

        if existed_account:
            raise ValueError("Account Number {0} already used in account {1}").format(
                self.account_number, existed_account.name
            )
