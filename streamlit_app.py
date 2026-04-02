import re
import os
from typing import Dict, List, Optional

import requests
import streamlit as st


API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/products")

CUSTOMER_TYPES = {
    "Dealer": 0.90,
    "Retail": 1.10,
}

BARCODE_PRODUCT_MAP = {
    "123456": "Cement Bag 50kg",
    "654321": "Steel Rod 10mm",
    "111222": "Wall Paint 20L",
}


def local_products() -> List[Dict]:
    return [
        {"id": 1, "name": "Cement Bag 50kg", "price": 380, "moq": 5},
        {"id": 2, "name": "Steel Rod 10mm", "price": 620, "moq": 3},
        {"id": 3, "name": "Wall Paint 20L", "price": 1150, "moq": 2},
        {"id": 4, "name": "Floor Tiles Box", "price": 890, "moq": 4},
    ]


def fetch_products() -> tuple[List[Dict], bool]:
    try:
        response = requests.get(API_URL, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("products", []), True
    except Exception:
        return local_products(), False


def validate_barcode(code: str) -> Dict[str, str]:
    clean_code = code.strip()
    match = re.search(r"(\d)$", clean_code)
    if not match:
        return {
            "product": BARCODE_PRODUCT_MAP.get(clean_code, "Unknown Product"),
            "status": "Invalid",
            "symbol": "❌",
            "reason": "Barcode must end with a digit.",
        }

    last_digit = int(match.group(1))
    is_valid = last_digit % 2 == 0
    return {
        "product": BARCODE_PRODUCT_MAP.get(clean_code, "Unknown Product"),
        "status": "Valid" if is_valid else "Invalid",
        "symbol": "✅" if is_valid else "❌",
        "reason": "Ends with even digit." if is_valid else "Ends with odd digit.",
    }


def get_product_by_name(products: List[Dict], selected_name: str) -> Optional[Dict]:
    for item in products:
        if item["name"] == selected_name:
            return item
    return None


st.set_page_config(page_title="Internal Business App Demo", layout="centered")
st.title("Internal Business App Demo")
st.caption("Python version: Order + Barcode + Local API integration")

products, api_ok = fetch_products()
if api_ok:
    st.success(f"Product list loaded from API: {API_URL}")
else:
    st.warning(
        "API unavailable, using local fallback product data. "
        "For full API mode, start api_server.py locally or set API_URL in deployment."
    )

tabs = st.tabs(["Order App", "Barcode Scanner"])

with tabs[0]:
    st.subheader("Order App")
    customer_type = st.radio("Customer Type", list(CUSTOMER_TYPES.keys()), horizontal=True)
    multiplier = CUSTOMER_TYPES[customer_type]

    st.markdown("### Product List (from API)")
    for product in products:
        adjusted_price = product["price"] * multiplier
        st.write(
            f"- **{product['name']}** | Price: Rs {adjusted_price:.2f} | MOQ: {product['moq']}"
        )

    st.markdown("### Place Order")
    product_names = [p["name"] for p in products]
    selected_name = st.selectbox("Select Product", product_names)
    quantity = st.number_input("Enter Quantity", min_value=1, step=1)

    if st.button("Place Order"):
        selected = get_product_by_name(products, selected_name)
        if not selected:
            st.error("Selected product not found.")
        elif quantity < selected["moq"]:
            st.error(f"MOQ validation failed. Minimum order quantity is {selected['moq']}.")
        else:
            unit_price = selected["price"] * multiplier
            total = unit_price * quantity
            st.success("Order placed successfully.")
            st.write(f"Product: **{selected['name']}**")
            st.write(f"Customer Type: **{customer_type}**")
            st.write(f"Quantity: **{int(quantity)}**")
            st.write(f"Unit Price: **Rs {unit_price:.2f}**")
            st.write(f"Total Price: **Rs {total:.2f}**")

with tabs[1]:
    st.subheader("Barcode Scanner Logic")
    st.caption(
        "Assignment rule: If barcode ends with even digit -> Valid, otherwise Invalid."
    )

    barcode = st.text_input("Enter or scan barcode")
    if st.button("Validate Barcode"):
        if not barcode.strip():
            st.warning("Please enter a barcode value.")
        else:
            result = validate_barcode(barcode)
            st.write(f"Product: **{result['product']}**")
            st.write(f"Status: **{result['symbol']} {result['status']}**")
            st.write(f"Reason: {result['reason']}")
