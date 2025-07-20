from django.contrib import admin
from .models.customer import Customer, CustomerGroup
from .models.company import Company


admin.site.register(Customer)
admin.site.register(CustomerGroup)
admin.site.register(Company)
