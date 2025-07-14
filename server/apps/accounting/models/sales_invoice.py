from django.db import models
from .base import BaseDocument
from .customer import Customer
from .company import Company


class SalesInvoice(BaseDocument):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    posting_date = models.DateField()

    posting_time = models.TimeField()
    due_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.CharField(max_length=50)
    is_pos = models.BooleanField(default=False)
    is_return = models.BooleanField(default=False)
    total_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    outstanding_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    #  Outstanding Amount (SAR)

    taxes_and_charges = models.CharField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        items = self.items.all()
        self.total_quantity = sum(item.quantity for item in items)
        self.total_amount = sum(item.amount for item in items)

        super().save(*args, **kwargs)
        ...


class SalesInvoiceItem(models.Model):
    sales_invoice = models.ForeignKey(
        "SalesInvoice", on_delete=models.CASCADE, related_name="items"
    )

    uom = models.CharField(max_length=50)
    item_code = models.CharField(max_length=255)
    item_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class SalesTaxesAndCharges(models.Model):
    """
    type
    Account Head
    Description
    Tax Rate
    Account Currency
    """

    type = models.CharField(
        max_length=50,
        choices=[
            ("tax", "Tax"),
            ("charge", "Charge"),
        ],
    )
    account_head = models.CharField(max_length=255)
    account_currency = models.CharField(max_length=50, blank=True, null=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    base_tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    base_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    name = models.CharField(max_length=255)
    rate = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True, null=True)
