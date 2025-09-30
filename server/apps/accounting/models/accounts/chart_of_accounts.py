STANDARD_COA_TEMPLATE = {
    "Application of Funds (Assets)": {
        "Current Assets": {
            "Accounts Receivable": {
                "Debtors": {"account_type": "Receivable", "account_number": "1310"},
                "account_number": "1300",
            },
            "Bank Accounts": {
                "account_type": "Bank",
                "is_group": 1,
                "account_number": "1200",
            },
            "Cash In Hand": {
                "Cash": {"account_type": "Cash", "account_number": "1110"},
                "account_type": "Cash",
                "account_number": "1100",
            },
            "Loans and Advances (Assets)": {
                "Employee Advances": {"account_number": "1610"},
                "account_number": "1600",
            },
            "Securities and Deposits": {
                "Earnest Money": {"account_number": "1651"},
                "account_number": "1650",
            },
            "Stock Assets": {
                "Stock In Hand": {"account_type": "Stock", "account_number": "1410"},
                "account_type": "Stock",
                "account_number": "1400",
            },
            "Tax Assets": {"is_group": 1, "account_number": "1500"},
            "account_number": "1100-1600",
        },
        "Fixed Assets": {
            "Capital Equipments": {
                "account_type": "Fixed Asset",
                "account_number": "1710",
            },
            "Electronic Equipments": {
                "account_type": "Fixed Asset",
                "account_number": "1720",
            },
            "Furnitures and Fixtures": {
                "account_type": "Fixed Asset",
                "account_number": "1730",
            },
            "Office Equipments": {
                "account_type": "Fixed Asset",
                "account_number": "1740",
            },
            "Plants and Machineries": {
                "account_type": "Fixed Asset",
                "account_number": "1750",
            },
            "Buildings": {"account_type": "Fixed Asset", "account_number": "1760"},
            "Softwares": {"account_type": "Fixed Asset", "account_number": "1770"},
            "Accumulated Depreciation": {
                "account_type": "Accumulated Depreciation",
                "account_number": "1780",
            },
            "CWIP Account": {
                "account_type": "Capital Work in Progress",
                "account_number": "1790",
            },
            "account_number": "1700",
        },
        "Investments": {"is_group": 1, "account_number": "1800"},
        "Temporary Accounts": {
            "Temporary Opening": {
                "account_type": "Temporary",
                "account_number": "1910",
            },
            "account_number": "1900",
        },
        "root_type": "Asset",
        "account_number": "1000",
    },
    "Expenses": {
        "Direct Expenses": {
            "Stock Expenses": {
                "Cost of Goods Sold": {
                    "account_type": "Cost of Goods Sold",
                    "account_number": "5111",
                },
                "Expenses Included In Asset Valuation": {
                    "account_type": "Expenses Included In Asset Valuation",
                    "account_number": "5112",
                },
                "Expenses Included In Valuation": {
                    "account_type": "Expenses Included In Valuation",
                    "account_number": "5118",
                },
                "Stock Adjustment": {
                    "account_type": "Stock Adjustment",
                    "account_number": "5119",
                },
                "account_number": "5110",
            },
            "account_number": "5100",
        },
        "Indirect Expenses": {
            "Administrative Expenses": {"account_number": "5201"},
            "Commission on Sales": {"account_number": "5202"},
            "Depreciation": {"account_type": "Depreciation", "account_number": "5203"},
            "Entertainment Expenses": {"account_number": "5204"},
            "Freight and Forwarding Charges": {
                "account_type": "Chargeable",
                "account_number": "5205",
            },
            "Legal Expenses": {"account_number": "5206"},
            "Marketing Expenses": {
                "account_type": "Chargeable",
                "account_number": "5207",
            },
            "Office Maintenance Expenses": {"account_number": "5208"},
            "Office Rent": {"account_number": "5209"},
            "Postal Expenses": {"account_number": "5210"},
            "Print and Stationery": {"account_number": "5211"},
            "Round Off": {"account_type": "Round Off", "account_number": "5212"},
            "Salary": {"account_number": "5213"},
            "Sales Expenses": {"account_number": "5214"},
            "Telephone Expenses": {"account_number": "5215"},
            "Travel Expenses": {"account_number": "5216"},
            "Utility Expenses": {"account_number": "5217"},
            "Write Off": {"account_number": "5218"},
            "Exchange Gain/Loss": {"account_number": "5219"},
            "Gain/Loss on Asset Disposal": {"account_number": "5220"},
            "Miscellaneous Expenses": {
                "account_type": "Chargeable",
                "account_number": "5221",
            },
            "account_number": "5200",
        },
        "root_type": "Expense",
        "account_number": "5000",
    },
    "Income": {
        "Direct Income": {
            "Sales": {"account_number": "4110"},
            "Service": {"account_number": "4120"},
            "account_number": "4100",
        },
        "Indirect Income": {"is_group": 1, "account_number": "4200"},
        "root_type": "Income",
        "account_number": "4000",
    },
    "Source of Funds (Liabilities)": {
        "Current Liabilities": {
            "Accounts Payable": {
                "Creditors": {"account_type": "Payable", "account_number": "2110"},
                "Payroll Payable": {"account_number": "2120"},
                "account_number": "2100",
            },
            "Stock Liabilities": {
                "Stock Received But Not Billed": {
                    "account_type": "Stock Received But Not Billed",
                    "account_number": "2210",
                },
                "Asset Received But Not Billed": {
                    "account_type": "Asset Received But Not Billed",
                    "account_number": "2211",
                },
                "account_number": "2200",
            },
            "Duties and Taxes": {
                "TDS Payable": {"account_number": "2310"},
                "account_type": "Tax",
                "is_group": 1,
                "account_number": "2300",
            },
            "Loans (Liabilities)": {
                "Secured Loans": {"account_number": "2410"},
                "Unsecured Loans": {"account_number": "2420"},
                "Bank Overdraft Account": {"account_number": "2430"},
                "account_number": "2400",
            },
            "account_number": "2100-2400",
        },
        "root_type": "Liability",
        "account_number": "2000",
    },
    "Equity": {
        "Capital Stock": {"account_type": "Equity", "account_number": "3100"},
        "Dividends Paid": {"account_type": "Equity", "account_number": "3200"},
        "Opening Balance Equity": {"account_type": "Equity", "account_number": "3300"},
        "Retained Earnings": {"account_type": "Equity", "account_number": "3400"},
        "root_type": "Equity",
        "account_number": "3000",
    },
}
