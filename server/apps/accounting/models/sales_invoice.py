from decimal import Decimal, ROUND_HALF_UP
from django.db import models
from django.db.models import QuerySet
from django.utils import timezone
from django.core.exceptions import ValidationError
from .base import BaseDocument
from .customer import Customer
from .company import Company


class TaxType(models.TextChoices):
    """Tax calculation types"""

    ON_NET_TOTAL = "on_net_total", "On Net Total"
    ACTUAL = "actual", "Actual"
    ON_PREVIOUS_ROW_AMOUNT = "on_previous_row_amount", "On Previous Row Amount"
    ON_PREVIOUS_ROW_TOTAL = "on_previous_row_total", "On Previous Row Total"
    ON_ITEM_QUANTITY = "on_item_quantity", "On Item Quantity"


class SalesInvoice(BaseDocument):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    posting_date = models.DateField(default=timezone.now)
    posting_time = models.TimeField()
    due_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)

    # Invoice flags
    is_pos = models.BooleanField(default=False)
    is_return = models.BooleanField(default=False)

    # Totals
    total_quantity = models.DecimalField(max_digits=15, decimal_places=3, default=0)
    base_net_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    base_grand_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # payments and outstanding
    outstanding_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # taxes and charges
    # add tax template in future
    taxes_and_charges = models.CharField(max_length=255, blank=True, null=True)

    # Rounding
    rounding_adjustment = models.DecimalField(
        max_digits=15, decimal_places=2, default=0
    )
    rounded_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # multi-currency support
    currency = models.CharField(max_length=3, default="USD")
    conversion_rate = models.DecimalField(max_digits=15, decimal_places=6, default=1)

    def apply_rounding(self):
        """Apply rounding to final total"""
        self.base_grand_total = self.net_total + self.total_taxes_and_charges

        # Round to nearest whole number (common practice)
        self.rounded_total = self.round_amount(self.base_grand_total, 0)
        self.rounding_adjustment = self.rounded_total - self.base_grand_total

        # Use rounded total as grand total
        self.grand_total = self.rounded_total

    def calculate_net_total(self):
        """Calculate net total from items"""
        items: QuerySet[SalesInvoiceItem] = self.items.all()

        if not items.exists():
            self.base_net_total = Decimal("0")
            self.net_total = Decimal("0")
            return

        # Calculate base net total
        self.base_net_total = sum(item.quantity * item.rate for item in items)
        # For now, assuming same currency (no conversion needed)
        self.net_total = self.base_net_total

        # # Update item amounts
        for item in items:
            item.save()

    def calculate_taxes(self):
        """Calculate all taxes and charges"""
        if not self.net_total:
            self.calculate_net_total()

        taxes: QuerySet[SalesTaxesAndCharges] = self.taxes.all().order_by("idx")
        if not taxes.exists():
            self.total_taxes_and_charges = Decimal("0")
            return
        current_total = self.net_total
        total_tax_amount = Decimal("0")

        for tax in taxes:
            tax_amount = Decimal("0")
            base_amount = Decimal("0")

            if tax.type == TaxType.ON_NET_TOTAL:
                # Calculate tax on net total
                base_amount = self.net_total
                if tax.tax_rate:
                    tax_amount = (base_amount * tax.tax_rate) / 100
                else:
                    tax_amount = tax.tax_amount or Decimal("0")

            elif tax.type == TaxType.ACTUAL:
                # Fixed tax amount
                tax_amount = tax.tax_amount or Decimal("0")
                base_amount = tax_amount

            # Round tax amount
            tax_amount = self.round_amount(tax_amount)
            current_total += tax_amount
            total_tax_amount += tax_amount

            # Update tax record
            tax.base_amount = base_amount
            tax.tax_amount = tax_amount
            tax.total = current_total
            tax.save(update_fields=["base_amount", "tax_amount", "total"])

        self.total_taxes_and_charges = total_tax_amount

    def round_amount(self, amount, precision=2):
        """Round amount to specified precision"""
        if precision == 0:
            return int(amount)
        return Decimal(str(amount)).quantize(
            Decimal("0." + "0" * precision), rounding=ROUND_HALF_UP
        )

    def calculate_totals(self):
        items: QuerySet[SalesInvoiceItem] = self.items.all()

        self.total_quantity = sum(item.quantity for item in items)

        self.calculate_net_total()
        self.calculate_taxes()
        self.apply_rounding()

        self.outstanding_amount = self.grand_total - self.paid_amount

    def save(self, *args, **kwargs):
        self.calculate_totals()
        super().save(*args, **kwargs)


class SalesInvoiceItem(models.Model):
    sales_invoice = models.ForeignKey(
        SalesInvoice, on_delete=models.CASCADE, related_name="items"
    )
    item_code = models.CharField(max_length=255)
    item_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    uom = models.CharField(max_length=50)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    net_rate = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.amount = self.quantity * self.rate
        self.net_rate = self.rate
        self.net_amount = self.amount

        super().save(*args, **kwargs)


class SalesTaxesAndCharges(models.Model):
    sales_invoice = models.ForeignKey(
        SalesInvoice, on_delete=models.CASCADE, related_name="taxes"
    )

    idx = models.PositiveIntegerField(default=0, help_text="Order of tax calculation")
    type = models.CharField(
        max_length=50,
        choices=TaxType.choices,
    )
    account_head = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    # Tax rates and amounts
    tax_rate = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Running totals for cascade calculations
    base_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.account_head} - {self.tax_rate}%"

    def clean(self):
        if self.type not in TaxType.values:
            raise ValidationError(f"Invalid tax type: {self.type}")

        if self.type != TaxType.ACTUAL and self.tax_amount > 0 and self.tax_rate == 0:
            raise ValidationError("Non-actual tax types should have tax rate")
