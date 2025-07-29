from django.contrib import admin
from .models.customer import Customer, CustomerGroup
from .models.company import Company
from .models.accounts import Account

admin.site.register(Customer)
admin.site.register(CustomerGroup)
admin.site.register(Company)
admin.site.register(Account)
