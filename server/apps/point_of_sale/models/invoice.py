from django.db import models
from apps.accounting.models.customer import Customer
from apps.stock.models import Product
from .profile import POSProfile
from .base import BaseModel, Branch

# class BaseInvoice: ...


class POSInvoice(BaseModel):
    invoice_no = models.CharField(max_length=255, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    posting_date = models.DateTimeField(auto_now_add=True)
    is_return = models.BooleanField(default=False)
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name="pos_invoices",
        blank=True,
    )
    pos_profile = models.ForeignKey(
        POSProfile,
        on_delete=models.CASCADE,
        related_name="invoices",
        blank=True,
        null=True,
    )

    def save(self, *args, **kwargs):
        if not self.invoice_no:
            self.invoice_no = f"INV-{self.created_at.strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)


class POSInvoiceItem(models.Model):
    invoice = models.ForeignKey(
        POSInvoice, on_delete=models.CASCADE, related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.amount = self.quantity * self.price
        super().save(*args, **kwargs)
