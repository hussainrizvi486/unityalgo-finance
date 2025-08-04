#!/usr/bin/env python
"""
Django script to create accounts for the Account model.
Run this script from your Django project directory with:
python manage.py shell < create_accounts.py
"""

import os
import django
from decimal import Decimal

# Setup Django environment (uncomment if running as standalone script)
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
# django.setup()

from apps.accounting.models.accounts import (
    Account,
    Company,
)  # Replace 'your_app' with actual app name


def create_sample_accounts():
    """
    Creates a comprehensive chart of accounts for a typical business.
    """

    # Get or create a company (adjust as needed)
    try:
        company = Company.objects.first()
        if not company:
            print("No company found. Please create a company first.")
            return
    except Exception as e:
        print(f"Error getting company: {e}")
        return

    # Define account structure
    accounts_data = [
        # ASSET ACCOUNTS
        {
            "account_number": "1000",
            "account_name": "ASSETS",
            "account_type": "ASSET",
            "is_group": True,
            "parent": None,
        },
        {
            "account_number": "1100",
            "account_name": "Current Assets",
            "account_type": "ASSET",
            "is_group": True,
            "parent": "1000",
        },
        {
            "account_number": "1101",
            "account_name": "Cash in Hand",
            "account_type": "ASSET",
            "parent": "1100",
        },
        {
            "account_number": "1102",
            "account_name": "Cash at Bank",
            "account_type": "ASSET",
            "parent": "1100",
        },
        {
            "account_number": "1103",
            "account_name": "Accounts Receivable",
            "account_type": "ASSET",
            "parent": "1100",
        },
        {
            "account_number": "1104",
            "account_name": "Inventory",
            "account_type": "ASSET",
            "parent": "1100",
        },
        {
            "account_number": "1105",
            "account_name": "Prepaid Expenses",
            "account_type": "ASSET",
            "parent": "1100",
        },
        {
            "account_number": "1200",
            "account_name": "Fixed Assets",
            "account_type": "ASSET",
            "is_group": True,
            "parent": "1000",
        },
        {
            "account_number": "1201",
            "account_name": "Property, Plant & Equipment",
            "account_type": "ASSET",
            "parent": "1200",
        },
        {
            "account_number": "1202",
            "account_name": "Accumulated Depreciation",
            "account_type": "ASSET",
            "parent": "1200",
        },
        # LIABILITY ACCOUNTS
        {
            "account_number": "2000",
            "account_name": "LIABILITIES",
            "account_type": "LIABILITY",
            "is_group": True,
            "parent": None,
        },
        {
            "account_number": "2100",
            "account_name": "Current Liabilities",
            "account_type": "LIABILITY",
            "is_group": True,
            "parent": "2000",
        },
        {
            "account_number": "2101",
            "account_name": "Accounts Payable",
            "account_type": "LIABILITY",
            "parent": "2100",
        },
        {
            "account_number": "2102",
            "account_name": "Accrued Expenses",
            "account_type": "LIABILITY",
            "parent": "2100",
        },
        {
            "account_number": "2103",
            "account_name": "Short-term Loans",
            "account_type": "LIABILITY",
            "parent": "2100",
        },
        {
            "account_number": "2104",
            "account_name": "Tax Payable",
            "account_type": "LIABILITY",
            "parent": "2100",
            "tax_rate": Decimal("18.00"),
        },
        {
            "account_number": "2200",
            "account_name": "Long-term Liabilities",
            "account_type": "LIABILITY",
            "is_group": True,
            "parent": "2000",
        },
        {
            "account_number": "2201",
            "account_name": "Long-term Loans",
            "account_type": "LIABILITY",
            "parent": "2200",
        },
        # EQUITY ACCOUNTS
        {
            "account_number": "3000",
            "account_name": "EQUITY",
            "account_type": "EQUITY",
            "is_group": True,
            "parent": None,
        },
        {
            "account_number": "3101",
            "account_name": "Share Capital",
            "account_type": "EQUITY",
            "parent": "3000",
        },
        {
            "account_number": "3102",
            "account_name": "Retained Earnings",
            "account_type": "EQUITY",
            "parent": "3000",
        },
        {
            "account_number": "3103",
            "account_name": "Current Year Earnings",
            "account_type": "EQUITY",
            "parent": "3000",
        },
        # INCOME ACCOUNTS
        {
            "account_number": "4000",
            "account_name": "INCOME",
            "account_type": "INCOME",
            "is_group": True,
            "parent": None,
        },
        {
            "account_number": "4100",
            "account_name": "Revenue",
            "account_type": "INCOME",
            "is_group": True,
            "parent": "4000",
        },
        {
            "account_number": "4101",
            "account_name": "Sales Revenue",
            "account_type": "INCOME",
            "parent": "4100",
            "tax_rate": Decimal("18.00"),
        },
        {
            "account_number": "4102",
            "account_name": "Service Revenue",
            "account_type": "INCOME",
            "parent": "4100",
            "tax_rate": Decimal("18.00"),
        },
        {
            "account_number": "4200",
            "account_name": "Other Income",
            "account_type": "INCOME",
            "is_group": True,
            "parent": "4000",
        },
        {
            "account_number": "4201",
            "account_name": "Interest Income",
            "account_type": "INCOME",
            "parent": "4200",
        },
        # EXPENSE ACCOUNTS
        {
            "account_number": "5000",
            "account_name": "EXPENSES",
            "account_type": "EXPENSE",
            "is_group": True,
            "parent": None,
        },
        {
            "account_number": "5100",
            "account_name": "Cost of Goods Sold",
            "account_type": "EXPENSE",
            "is_group": True,
            "parent": "5000",
        },
        {
            "account_number": "5101",
            "account_name": "Direct Materials",
            "account_type": "EXPENSE",
            "parent": "5100",
        },
        {
            "account_number": "5102",
            "account_name": "Direct Labor",
            "account_type": "EXPENSE",
            "parent": "5100",
        },
        {
            "account_number": "5200",
            "account_name": "Operating Expenses",
            "account_type": "EXPENSE",
            "is_group": True,
            "parent": "5000",
        },
        {
            "account_number": "5201",
            "account_name": "Salaries & Wages",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5202",
            "account_name": "Rent Expense",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5203",
            "account_name": "Utilities Expense",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5204",
            "account_name": "Office Supplies",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5205",
            "account_name": "Depreciation Expense",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5206",
            "account_name": "Marketing & Advertising",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5207",
            "account_name": "Professional Fees",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
        {
            "account_number": "5208",
            "account_name": "Travel & Entertainment",
            "account_type": "EXPENSE",
            "parent": "5200",
        },
    ]

    # Dictionary to store created accounts for parent relationships
    created_accounts = {}

    print("Creating accounts...")

    for account_data in accounts_data:
        try:
            # Check if account already exists
            if Account.objects.filter(
                account_number=account_data["account_number"]
            ).exists():
                print(
                    f"Account {account_data['account_number']} already exists, skipping..."
                )
                account = Account.objects.get(
                    account_number=account_data["account_number"]
                )
                created_accounts[account_data["account_number"]] = account
                continue

            # Get parent account if specified
            parent_account = None
            if account_data.get("parent"):
                parent_number = account_data["parent"]
                if parent_number in created_accounts:
                    parent_account = created_accounts[parent_number]
                else:
                    try:
                        parent_account = Account.objects.get(
                            account_number=parent_number
                        )
                    except Account.DoesNotExist:
                        print(
                            f"Warning: Parent account {parent_number} not found for {account_data['account_number']}"
                        )

            # Create the account
            account = Account.objects.create(
                account_number=account_data["account_number"],
                account_name=account_data["account_name"],
                account_type=account_data["account_type"],
                parent=parent_account,
                company=company,
                tax_rate=account_data.get("tax_rate", Decimal("0.00")),
                is_group=account_data.get("is_group", False),
                frozen=account_data.get("frozen", False),
                disabled=account_data.get("disabled", False),
            )

            created_accounts[account_data["account_number"]] = account
            print(f"Created: {account}")

        except Exception as e:
            print(f"Error creating account {account_data['account_number']}: {e}")

    print(f"\nAccount creation completed! Created {len(created_accounts)} accounts.")


def create_custom_account(
    account_number,
    account_name,
    account_type="ASSET",
    parent_number=None,
    tax_rate=0,
    is_group=False,
):
    """
    Create a single custom account.

    Args:
        account_number (str): Unique account number
        account_name (str): Account name
        account_type (str): Account type (ASSET, LIABILITY, EQUITY, INCOME, EXPENSE)
        parent_number (str): Parent account number (optional)
        tax_rate (float): Tax rate for the account
        is_group (bool): Whether this is a group account
    """
    try:
        company = Company.objects.first()
        if not company:
            print("No company found. Please create a company first.")
            return None

        parent_account = None
        if parent_number:
            try:
                parent_account = Account.objects.get(account_number=parent_number)
            except Account.DoesNotExist:
                print(f"Parent account {parent_number} not found.")
                return None

        account = Account.objects.create(
            account_number=account_number,
            account_name=account_name,
            account_type=account_type,
            parent=parent_account,
            company=company,
            tax_rate=Decimal(str(tax_rate)),
            is_group=is_group,
        )

        print(f"Created custom account: {account}")
        return account

    except Exception as e:
        print(f"Error creating custom account: {e}")
        return None


# if __name__ == "__main__":
#     # Create sample chart of accounts
#     create_sample_accounts()

    # Example of creating custom accounts
    # create_custom_account('1106', 'Petty Cash', 'ASSET', '1100')
    # create_custom_account('5209', 'Insurance Expense', 'EXPENSE', '5200', tax_rate=5.0)
