from django.utils import timezone
from django.db import models
from apps.accounting.models.customer import Customer
from apps.stock.models import Product
from .profile import POSProfile
from .base import BaseModel, Branch


# class BaseInvoice: ...


class POSInvoice(BaseModel):
    invoice_no = models.CharField(max_length=255, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    posting_date = models.DateTimeField(default=timezone.now())
    is_return = models.BooleanField(default=False)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="pos_invoices",
        blank=True,
        null=True,
    )
    pos_profile = models.ForeignKey(
        POSProfile,
        on_delete=models.CASCADE,
        related_name="invoices",
        blank=True,
        null=True,
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, blank=True, null=True
    )

    discount_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00
    )

    def save(self, *args, **kwargs):
        current_time = timezone.now()
        if not self.invoice_no:
            self.invoice_no = f"INV-{current_time.strftime('%Y%m%d%H%M%S')}"

        self.total_amount = sum(item.amount for item in self.items.all())
        self.total_quantity = sum(item.quantity for item in self.items.all())
        self.grand_total = self.total_amount - self.discount_amount

        super().save(*args, **kwargs)

    def calculate_totals(self):
        items = self.items.all()
        self.discount_amount = sum(item.discount_amount for item in items)
        self.total_amount = sum(item.amount for item in items)
        self.total_quantity = sum(item.quantity for item in items)
        self.save()


class POSInvoiceItem(models.Model):
    invoice = models.ForeignKey(
        POSInvoice, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.00)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    net_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    discount_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, blank=True, null=True
    )

    def save(self, *args, **kwargs):
        self.net_price = self.price
        self.net_amount = self.quantity * self.net_price

        if self.discount_amount:
            self.price = self.net_price - self.discount_amount

        self.amount = self.quantity * self.price
        self.invoice.calculate_totals()

        super().save(*args, **kwargs)
