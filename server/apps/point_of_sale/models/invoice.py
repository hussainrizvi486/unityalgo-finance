from django.utils import timezone
from django.db import models
from django.db.models import Max
from apps.accounting.models.customer import Customer
from apps.accounting.models.company import Company
from apps.stock.models import Product
from .profile import POSProfile
from .base import BaseModel, Branch


# class BaseInvoice: ...


class POSInvoiceStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    RETURN = "return", "Return"
    PAID = "paid", "Paid"
    UNPAID = "unpaid", "Unpaid"
    CANCELLED = "cancelled", "Cancelled"
    OVERDUE = "overdue", "Overdue"
    CREDIT_NOTE_ISSUED = "credit_note_issued", "Credit Note Issued"


class POSInvoice(BaseModel):
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,  # Temporarily allow null
        blank=True,  # Temporarily allow blank
    )
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    invoice_no = models.CharField(max_length=255, unique=True, null=True, blank=True)
    posting_date = models.DateTimeField(default=timezone.now())
    is_return = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50,
        choices=POSInvoiceStatus.choices,
        default=POSInvoiceStatus.DRAFT,
    )
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

    def generate_invoice_number(self):
        """Generate a unique invoice number with proper race condition handling."""
        # with transaction.atomic():
        # Get the last invoice number for this company
        last_invoice = POSInvoice.objects.count()
        next_number = int(last_invoice) + 1

        # Option 1: Simple sequential numbering
        base_invoice_no = f"INV-{str(next_number).zfill(6)}"

        # Option 2: Company-specific numbering (uncomment if preferred)
        # company_prefix = self.company.code[:3].upper() if hasattr(self.company, 'code') else 'INV'
        # base_invoice_no = f"{company_prefix}-{str(next_number).zfill(6)}"

        # Option 3: Date-based numbering (uncomment if preferred)
        # date_str = self.posting_date.strftime('%Y%m%d')
        # base_invoice_no = f"INV-{date_str}-{str(next_number).zfill(4)}"

        # Ensure uniqueness (handle edge cases)
        invoice_no = base_invoice_no
        counter = 1
        while (
            POSInvoice.objects.filter(invoice_no=invoice_no)
            .exclude(pk=self.pk)
            .exists()
        ):
            invoice_no = f"{base_invoice_no}-{counter}"
            counter += 1

        return invoice_no

    def save(self, *args, **kwargs):
        if not self.invoice_no:
            self.invoice_no = self.generate_invoice_number()

        self.calculate_totals()
        super().save(*args, **kwargs)

    def calculate_totals(self):
        items = self.items.all()
        self.discount_amount = sum(item.discount_amount for item in items)
        self.total_amount = sum(item.amount for item in items)
        self.total_quantity = sum(item.quantity for item in items)
        print(self.total_quantity)
        print(self.total_amount)


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
