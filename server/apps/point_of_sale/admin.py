from django.contrib import admin
from .models.base import Branch
from .models.profile import POSProfile
from .models.invoice import POSInvoice, POSInvoiceItem


admin.site.register(Branch)
admin.site.register(POSProfile)


class POSInvoiceItemInline(admin.TabularInline):
    model = POSInvoiceItem
    extra = 0


@admin.register(POSInvoice)
class POSInvoiceAdmin(admin.ModelAdmin):
    inlines = [POSInvoiceItemInline]
    list_display = ["invoice_no", "customer", "grand_total"]
