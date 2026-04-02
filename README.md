# Internal App Demo (Python)

This is a Python implementation of the assignment:
**Build a Simple Internal Business App (Order + Barcode)**.

## What Is Implemented

### Part 1: Order App
- Product list with Product Name, Price, MOQ
- Place order flow with:
  - Product selection
  - Quantity input
  - MOQ validation
  - Total price calculation
- Customer type pricing:
  - Dealer -> lower price (10% discount)
  - Retail -> higher price (10% markup)

### Part 2: Barcode Scanner Logic
- Barcode validation logic:
  - Ends with even digit -> Valid
  - Ends with odd digit -> Invalid
- Dummy barcode-to-product mapping

### Part 3: API Integration (Non-negotiable)
- Local API created with FastAPI (`api_server.py`)
- Product list fetched from API into UI (`streamlit_app.py`)

## Tech Stack
- Python
- FastAPI (local API)
- Streamlit (UI)
- Requests (API client)

## Project Files
- `api_server.py` -> local API for product data
- `streamlit_app.py` -> app UI for order and barcode flow
- `requirements.txt` -> Python dependencies

## How To Run (Windows PowerShell)

1. Create and activate virtual environment:
```powershell
python -m venv .venv
.venv\Scripts\activate
```

2. Install dependencies:
```powershell
pip install -r requirements.txt
```

3. Start API server (Terminal 1):
```powershell
python api_server.py
```

4. Start app UI (Terminal 2):
```powershell
streamlit run streamlit_app.py
```

5. Open browser:
- Streamlit URL usually: `http://localhost:8501`

## Submission Notes (Copy/Paste Ready)

### Approach Taken
I built the assignment using Python with two components: a FastAPI local backend and a Streamlit frontend.  
The Order App includes product listing, MOQ validation, customer-type based pricing, and total amount calculation.  
The Barcode module validates barcodes using the assignment rule (even-ending digit = valid, odd = invalid) and maps barcode values to dummy products.  
For API integration, product data is fetched from a local FastAPI endpoint.

### Challenges Faced
A key challenge was keeping the implementation simple while still covering all required logic and API integration.  
I solved this by separating backend API and frontend UI clearly so each assignment requirement is easy to demonstrate.

### What I Would Improve
If given more time, I would:
- Add real camera-based barcode scanning
- Add persistent order history in a database
- Add authentication and role-based access
- Add automated tests for MOQ and pricing rules

## Deliverables Checklist
- [ ] Demo video (recommended for Python version)
- [ ] GitHub code link
- [ ] Short explanation (Approach, Challenges, Improvements)
