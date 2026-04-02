# Internal App Demo (Order + Barcode)

This project is a simple React Native (Expo) mobile app built for the assignment:
**Build a Simple Internal Business App (Order + Barcode)**.

## What Is Implemented

### Part 1: Order App (Core Test)
- Product list with:
  - Product Name
  - Price
  - MOQ (Minimum Order Quantity)
- Order placement flow:
  - Select product
  - Enter quantity
  - MOQ validation (cannot order below MOQ)
  - Total price calculation
- Customer type pricing logic:
  - Dealer -> lower price (10% less)
  - Retail -> higher price (10% more)

### Part 2: Barcode Scanner (Real Test)
- Live barcode scanning via camera (`expo-camera`)
- On scan:
  - Product name shown using dummy mapping
  - Status shown:
    - Valid if barcode ends with even digit
    - Invalid if barcode ends with odd digit
- Manual barcode input fallback included for demo reliability

### Part 3: API Integration (Critical Filter)
- Product list fetched through a simulated local API (`src/services/api.js`)
- Async fetch with delay to mimic real backend behavior

## Tech Stack
- React Native
- Expo
- `expo-camera`

## Project Structure
- `App.js` -> main app UI + order + barcode logic
- `src/services/api.js` -> simulated API source for products
- `app.json` -> app config and camera permission text

## How To Run
1. Install dependencies:
```bash
npm install
```
2. Start app:
```bash
npm run start
```
3. Run on Android:
```bash
npm run android
```

## Submission Notes (Copy/Paste Ready)

### Approach Taken
I built a single mobile app with two core sections: Order App and Barcode Scanner.  
For Order App, I implemented product listing, MOQ validation, customer-type based pricing, and order summary calculation.  
For Barcode Scanner, I integrated camera scanning and applied the assignment rule (even-ending barcode = valid, odd = invalid), with dummy product mapping.  
For API integration, I simulated an async local API call to fetch product data.

### Challenges Faced
The main challenge was keeping the demo reliable across devices where camera permissions or scanning conditions may vary.  
To handle this, I added a manual barcode input fallback so the validation logic can still be demonstrated in all cases.

### What I Would Improve
If given more time, I would:
- Add persistent order history (local storage or backend)
- Use a real hosted API/Firebase with authentication
- Improve scanner UX with scan overlays and duplicate-scan handling
- Add unit tests for MOQ validation and pricing rules

## Deliverables Checklist
- [ ] APK file **or** demo video
- [ ] GitHub repository link
- [ ] Short explanation (Approach, Challenges, Improvements) from above section
