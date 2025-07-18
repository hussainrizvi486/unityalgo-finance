"""
Django script to insert temporary records for ProductCategory and Product models.
Save this as a Django management command or run it in Django shell.
"""

import os
from apps.stock.models import ProductCategory, Product
import django
from django.conf import settings
import random
from faker import Faker

# If running as standalone script, uncomment and modify these lines:
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
# django.setup()

# Import your models (adjust the import path as needed)
# from your_app.models import ProductCategory, Product

fake = Faker()


def create_sample_categories():
    """Create sample product categories with parent-child relationships"""

    # Main categories
    main_categories = [
        {"name": "Electronics", "description": "Electronic devices and gadgets"},
        {"name": "Clothing", "description": "Apparel and fashion items"},
        {
            "name": "Home & Garden",
            "description": "Home improvement and gardening supplies",
        },
        {
            "name": "Sports & Outdoors",
            "description": "Sports equipment and outdoor gear",
        },
        {"name": "Books & Media", "description": "Books, movies, and digital media"},
        {"name": "Health & Beauty", "description": "Health and beauty products"},
        {"name": "Automotive", "description": "Car parts and automotive accessories"},
        {"name": "Food & Beverages", "description": "Food items and beverages"},
    ]

    # Create main categories
    created_categories = []
    for cat_data in main_categories:
        category, created = ProductCategory.objects.get_or_create(
            name=cat_data["name"],
            defaults={"description": cat_data["description"], "parent": None},
        )
        created_categories.append(category)
        if created:
            print(f"Created main category: {category.name}")

    # Subcategories for each main category
    subcategories = {
        "Electronics": [
            "Smartphones",
            "Laptops",
            "Tablets",
            "Cameras",
            "Audio Equipment",
            "Gaming Consoles",
            "Smart Home",
            "Wearable Tech",
        ],
        "Clothing": [
            "Men's Clothing",
            "Women's Clothing",
            "Children's Clothing",
            "Shoes",
            "Accessories",
            "Jewelry",
            "Watches",
        ],
        "Home & Garden": [
            "Furniture",
            "Kitchen Appliances",
            "Home Decor",
            "Garden Tools",
            "Lighting",
            "Storage Solutions",
            "Bedding",
        ],
        "Sports & Outdoors": [
            "Fitness Equipment",
            "Team Sports",
            "Water Sports",
            "Camping",
            "Cycling",
            "Running",
            "Winter Sports",
        ],
        "Books & Media": [
            "Fiction Books",
            "Non-Fiction Books",
            "Movies",
            "Music",
            "Video Games",
            "Magazines",
            "E-books",
        ],
        "Health & Beauty": [
            "Skincare",
            "Makeup",
            "Hair Care",
            "Supplements",
            "Personal Care",
            "Fragrances",
            "Medical Supplies",
        ],
        "Automotive": [
            "Car Parts",
            "Tires",
            "Car Care",
            "Tools",
            "Electronics",
            "Interior Accessories",
            "Exterior Accessories",
        ],
        "Food & Beverages": [
            "Fresh Produce",
            "Dairy Products",
            "Beverages",
            "Snacks",
            "Frozen Foods",
            "Canned Goods",
            "Spices & Seasonings",
        ],
    }

    # Create subcategories
    for main_cat in created_categories:
        if main_cat.name in subcategories:
            for sub_name in subcategories[main_cat.name]:
                subcategory, created = ProductCategory.objects.get_or_create(
                    name=sub_name,
                    defaults={
                        "parent": main_cat,
                        "description": f"{sub_name} in {main_cat.name} category",
                    },
                )
                if created:
                    print(
                        f"Created subcategory: {subcategory.name} under {main_cat.name}"
                    )

    return ProductCategory.objects.all()


def create_sample_products(num_products=50):
    """Create sample products"""

    categories = list(ProductCategory.objects.all())
    if not categories:
        print("No categories found. Creating categories first...")
        categories = create_sample_categories()

    # Sample product data templates
    product_templates = {
        "Electronics": [
            {"name": "iPhone 15 Pro", "base_sku": "IPH15P"},
            {"name": "Samsung Galaxy S24", "base_sku": "SGS24"},
            {"name": "MacBook Pro 14", "base_sku": "MBP14"},
            {"name": "Dell XPS 13", "base_sku": "DXPS13"},
            {"name": "Sony WH-1000XM5", "base_sku": "SWXM5"},
            {"name": "Canon EOS R5", "base_sku": "CEOSR5"},
        ],
        "Clothing": [
            {"name": "Cotton T-Shirt", "base_sku": "CTSH"},
            {"name": "Denim Jeans", "base_sku": "DJEANS"},
            {"name": "Running Shoes", "base_sku": "RSHOES"},
            {"name": "Leather Jacket", "base_sku": "LJACK"},
            {"name": "Wool Sweater", "base_sku": "WSWEAT"},
        ],
        "Home & Garden": [
            {"name": "Coffee Table", "base_sku": "CTABLE"},
            {"name": "Garden Hose", "base_sku": "GHOSE"},
            {"name": "LED Desk Lamp", "base_sku": "LDLAMP"},
            {"name": "Storage Bin", "base_sku": "SBIN"},
        ],
        "Sports & Outdoors": [
            {"name": "Yoga Mat", "base_sku": "YMAT"},
            {"name": "Tennis Racket", "base_sku": "TRACK"},
            {"name": "Camping Tent", "base_sku": "CTENT"},
            {"name": "Bicycle Helmet", "base_sku": "BHELM"},
        ],
        "Books & Media": [
            {"name": "Programming Book", "base_sku": "PBOOK"},
            {"name": "Action Movie DVD", "base_sku": "AMDVD"},
            {"name": "Gaming Headset", "base_sku": "GHEAD"},
        ],
        "Health & Beauty": [
            {"name": "Face Moisturizer", "base_sku": "FMOIST"},
            {"name": "Vitamin C Serum", "base_sku": "VITC"},
            {"name": "Hair Conditioner", "base_sku": "HCOND"},
        ],
        "Automotive": [
            {"name": "Car Battery", "base_sku": "CBATT"},
            {"name": "Motor Oil", "base_sku": "MOIL"},
            {"name": "Tire Pressure Gauge", "base_sku": "TPGAUGE"},
        ],
        "Food & Beverages": [
            {"name": "Organic Apples", "base_sku": "OAPPLE"},
            {"name": "Greek Yogurt", "base_sku": "GYOGH"},
            {"name": "Green Tea", "base_sku": "GTEA"},
        ],
    }

    # Unit of measure options
    uom_options = ["pcs", "kg", "lbs", "liter", "meter", "box", "pack", "set", "pair"]

    created_products = []

    for i in range(num_products):
        # Select a random category
        category = random.choice(categories)

        # Get the root category name for product templates
        root_category = category
        while root_category.parent:
            root_category = root_category.parent

        # Select product template based on category
        if root_category.name in product_templates:
            template = random.choice(product_templates[root_category.name])
            product_name = template["name"]
            base_sku = template["base_sku"]
        else:
            # Generate random product if no template
            product_name = fake.catch_phrase()
            base_sku = "PROD"

        # Generate unique SKU
        sku = f"{base_sku}{random.randint(1000, 9999)}"

        # Ensure SKU is unique
        while Product.objects.filter(sku=sku).exists():
            sku = f"{base_sku}{random.randint(1000, 9999)}"

        # Create product
        product = Product.objects.create(
            sku=sku,
            product_name=f"{product_name} - {fake.color_name()}",
            description=fake.text(max_nb_chars=200),
            category=category,
            main_stock=random.choice([True, False]),
            stock_uom=random.choice(uom_options),
        )

        created_products.append(product)
        print(f"Created product: {product.product_name} (SKU: {product.sku})")

    return created_products


def delete_temp_records():
    """Delete all temporary records (use with caution!)"""
    product_count = Product.objects.count()
    category_count = ProductCategory.objects.count()

    Product.objects.all().delete()
    ProductCategory.objects.all().delete()

    print(f"Deleted {product_count} products and {category_count} categories")


def main():
    """Main function to run the script"""
    print("Creating temporary records for Django models...")
    print("=" * 50)

    try:
        # Create categories first
        print("1. Creating product categories...")
        categories = create_sample_categories()
        print(f"Total categories created: {len(categories)}")

        # Create products
        print("\n2. Creating products...")
        products = create_sample_products(num_products=30)
        print(f"Total products created: {len(products)}")

        print("\n" + "=" * 50)
        print("Temporary records created successfully!")
        print(f"Categories: {ProductCategory.objects.count()}")
        print(f"Products: {Product.objects.count()}")

    except Exception as e:
        print(f"Error occurred: {str(e)}")
