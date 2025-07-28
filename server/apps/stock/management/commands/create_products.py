from django.core.management.base import BaseCommand
from apps.stock.models import Product, ProductPrice, PriceList, ProductCategory
from django.core.files.base import ContentFile

products = [
    {
        "image": "https://m.media-amazon.com/images/I/61BJ2MpgTTL._AC_UL320_.jpg",
        "product_name": "Viper V3 Pro Wireless Esports Gaming Mouse: Symmetrical - 54g Lightweight - 8K Polling - 35K DPI Optical Sensor - Gen3 Optical Switches - 8 Programmable Buttons - 95 Hr Battery - Black",
        "price": 152.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61YULkQowXL._AC_UL320_.jpg",
        "product_name": "Naga V2 HyperSpeed Wireless MMO Gaming Mouse: 19 Programmable Buttons - HyperScroll Technology - Focus Pro 30K Optical Sensor - Mechanical Mouse Switches Gen-2 - Up to 400 Hr Battery Life",
        "price": 79.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71fRKz9pUnL._AC_UL320_.jpg",
        "product_name": "DeathAdder V3 Pro Gaming Mouse: 63g Ultra Lightweight - Focus Pro 30K Optical Sensor - Fast Optical Switches Gen-3 - HyperSpeed Wireless - 5 Programmable Buttons - 90 Hr Battery - Black",
        "price": 90.00,
    },
    {
        "image": "https://m.media-amazon.com/images/I/619xpFKAXPL._AC_UL640_QL65_.jpg",
        "product_name": "Razer Viper V3 Pro Wireless Esports Gaming Mouse: Symmetrical - 55g Lightweight - 8K Polling - 35K DPI Optical Sensor - Gen3 Optical Switches - 8 Programmable Buttons - 95 Hr Battery - White",
        "price": 159.00,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61AcT0ZuO3L._AC_UL320_.jpg",
        "product_name": "Basilisk V3 Customizable Ergonomic Gaming Mouse: Fastest Gaming Mouse Switch - Chroma RGB Lighting - 26K DPI Optical Sensor - 11 Programmable Buttons - HyperScroll Tilt Wheel - Classic Black",
        "price": 39.98,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61okFRY8uPL._AC_UL320_.jpg",
        "product_name": "Basilisk V3 X HyperSpeed Customizable Wireless Gaming Mouse: Mechanical Switches Gen-2-5G Advanced 18K Optical Sensor - Chroma RGB 9 Programmable Controls 535 Hr Battery Classic Black",
        "price": 45.78,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71L-flqtTwL._AC_UL320_.jpg",
        "product_name": "Basilisk V3 Pro Wireless Gaming Mouse: HyperScroll Tilt Wheel - 30K DPI Optical Sensor - Gen-3 Optical Switches - 13-Zone Chroma RGB - 13 Programmable Controls - 3 Connection Modes - Black",
        "price": 103.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71fmQEoF1fL._AC_UL320_.jpg",
        "product_name": "BlackShark V2 HyperSpeed Wireless Gaming Headset: 280g Lightweight - THX Spatial Audio - Bendable Mic - 50mm Drivers - 2.4GHz, Bluetooth or USB - 70 Hr Battery w/USB Type C Charging - Black",
        "price": 129.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/51qyksHHlWL._AC_UL320_.jpg",
        "product_name": "Viper V2 Pro HyperSpeed Wireless Gaming Mouse: 58g Ultra Lightweight - Optical Switches Gen-3-30K DPI Optical Sensor w/On-Mouse Controls - 90 Hour Battery - USB Type C Cable Included - Black",
        "price": 99.83,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61LI6E0sJwL._AC_UL320_.jpg",
        "product_name": "Viper V3 HyperSpeed Wireless Esports Gaming Mouse: 82g Lightweight - Up to 280 Hr Battery - 30K DPI Optical Sensor - Gen-2 Mechanical Switches - 8 Programmable Controls - Classic Black",
        "price": 62.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61EZQh0-TZL._AC_UL320_.jpg",
        "product_name": "Pulsefire Haste – Wireless Gaming Mouse – Ultra Lightweight, 61g, 100 Hour Battery Life, 2.4Ghz Wireless, Honeycomb Shell, Hex Design, Up to 16000 DPI, 6 Programmable Buttons – Black, 4P5D7AA",
    },
    {
        "image": "https://m.media-amazon.com/images/I/61UU+zgCUpL._AC_UL320_.jpg",
        "product_name": "Pro Glide Soft Mouse Mat: Thick, High-Density Rubber Foam - Textured Micro-Weave Cloth Surface - Anti-Slip Base - XXL Size",
        "price": 29.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71qKH+vJ+IL._AC_UL320_.jpg",
        "product_name": "Barracuda X Wireless Gaming & Mobile Headset (PC, PlayStation, Switch, Android, iOS): 2.4GHz Wireless + Bluetooth - Lightweight - 40mm Drivers - Detachable Mic - 50 Hr Battery - Mercury White",
        "price": 94.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71MGiPTwXAL._AC_UL320_.jpg",
        "product_name": "BlackShark V2 X Gaming Headset: 7.1 Surround Sound - 50mm Drivers - Memory Foam Cushion - for PC, Mac, PS4, PS5, Switch - 3.5mm Audio Jack - White",
        "price": 39.98,
    },
    {
        "image": "https://m.media-amazon.com/images/I/51VcpeUZjVL._AC_UL320_.jpg",
        "product_name": "Pulsefire Haste 2 Core Wireless – Gaming Mouse for PC, Long Battery Life, Lightweight, Custom Core Sensor, Dual Wireless Connectivity, White",
        "price": 39.50,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UL320_.jpg",
        "product_name": "HyperX Cloud Alpha - Gaming Headset, Dual Chamber Drivers, Legendary Comfort, Aluminum Frame, Detachable Microphone, Works on PC, PS4, PS5, Xbox One/ Series X|S, Nintendo Switch and Mobile – Red",
    },
    {
        "image": "https://m.media-amazon.com/images/I/51e6ABlkPZL._AC_UL320_.jpg",
        "product_name": "Orochi V2 Mobile Wireless Gaming Mouse: Ultra Lightweight - 2 Wireless Modes - Up to 950hrs Battery Life - Mechanical Mouse Switches - 5G Advanced 18K DPI Optical Sensor - White",
        "price": 41.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71r3ktfakgL._AC_UL320_.jpg",
        "product_name": "Tartarus V2 Gaming Keypad: Mecha Membrane Key Switches - One Handed Keyboard - 32 Programmable Keys - Customizable Chroma RGB Lighting - Programmable Macros - Snap Tap - Black",
        "price": 79.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/51tN0wh4DlL._AC_UL320_.jpg",
        "product_name": "Wrist Rest – Tenkeyless – Cooling Gel – Memory Foam – Anti-Slip,Black",
        "price": 22.95,
    },
    {
        "image": "https://m.media-amazon.com/images/I/8189uwDnMkL._AC_UL320_.jpg",
        "product_name": "DeathAdder Essential Gaming Mouse: 6400 DPI Optical Sensor - 5 Programmable Buttons - Mechanical Switches - Rubber Side Grips - Classic Black",
        "price": 20.98,
    },
    {
        "image": "https://m.media-amazon.com/images/I/61N55jovDVL._AC_UL320_.jpg",
        "product_name": "Cobra Gaming Mouse: 58g, Gen-3 Optical Switches, Chroma RGB Lighting, 8500 DPI Sensor, PTFE Feet, Speedflex Cable - Black",
        "price": 34.90,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71LZTxxNVxL._AC_UL320_.jpg",
        "product_name": "Alloy Origins 60 - Mechanical Gaming Keyboard, Ultra Compact 60% Form Factor, Double Shot PBT Keycaps, RGB LED Backlit, NGENUITY Software Compatible - Linear HyperX Red Switch,Black",
    },
    {
        "image": "https://m.media-amazon.com/images/I/71pFeJFdJQL._AC_UL320_.jpg",
        "product_name": "Cloud Alpha Wireless - Gaming Headset for PC, 300-hour battery life, DTS Headphone:X Spatial Audio, Memory foam, Dual Chamber Drivers, Noise-canceling mic, Durable aluminum frame,Red",
    },
    {
        "image": "https://m.media-amazon.com/images/I/417ZShh5RCL._AC_UL320_.jpg",
        "product_name": "Pro Click Mini Portable Wireless Mouse: Silent, Tactile, Mouse Clicks - Sleek & Compact Design - HyperScroll Technology - Productivity Dongle - Connect up to 4 Devices - 7 Programmable Buttons",
        "price": 47.54,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71SfcN143LL._AC_UL320_.jpg",
        "product_name": "DeathAdder V3 HyperSpeed Wireless Gaming Mouse: 55g Lightweight - USB C Charging - Up to 100 Hr Battery - Advanced 26K Optical Sensor - Gen-3 Optical Switches - 8 Programmable Controls - Black",
        "price": 74.99,
    },
    {
        "image": "https://m.media-amazon.com/images/I/71fRKz9pUnL._AC_UL640_QL65_.jpg",
        "product_name": "Razer DeathAdder V3 Pro Gaming Mouse: 63g Ultra Lightweight - Focus Pro 30K Optical Sensor - Fast Optical Switches Gen-3 - HyperSpeed Wireless - 5 Programmable Buttons - 90 Hr Battery - Black",
        "price": 90.00,
    },
]
import requests


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        for i in products:
            image = i["image"]
            file = None
            if image:
                response = requests.get(image)
                image = response.content
                import uuid

                image_name = f"{str(uuid.uuid4())}_cover.jpg"  # You might want to extract extension from URL
                file = ContentFile(image, name=image_name)
            product = Product.objects.create(
                sku=i.get(
                    "sku", f"SKU-{i.get('product_name', '').replace(' ', '-').lower()}"
                ),
                category=ProductCategory.objects.first(),
                product_name=i["product_name"],
                cover_image=file,
            )

            ProductPrice.objects.create(
                product=product,
                price=i.get("price", 0.0),
                price_list=PriceList.objects.first(),
            )
            self.stdout.write(
                self.style.WARNING(f"Product '{product.product_name}' already exists.")
            )
