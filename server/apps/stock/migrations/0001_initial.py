# Generated by Django 5.2.4 on 2025-07-18 13:24

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ProductCategory',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subcategories', to='stock.productcategory')),
            ],
            options={
                'verbose_name_plural': 'Product Categories',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('sku', models.CharField(max_length=100, unique=True)),
                ('product_name', models.CharField(max_length=999)),
                ('description', models.TextField(blank=True, null=True)),
                ('main_stock', models.BooleanField(default=False)),
                ('stock_uom', models.CharField(default='pcs', max_length=50)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='stock.productcategory')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
