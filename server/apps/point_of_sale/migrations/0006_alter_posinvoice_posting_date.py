# Generated by Django 5.2.4 on 2025-07-21 21:38

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('point_of_sale', '0005_posinvoice_total_amount_posinvoice_total_quantity_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posinvoice',
            name='posting_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 7, 21, 21, 38, 33, 70919, tzinfo=datetime.timezone.utc)),
        ),
    ]
