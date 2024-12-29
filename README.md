# Options Rise and Fall - Deriv API Example

This project demonstrates how to use the **Deriv API** to implement an **options trading system** for rise and fall contracts.

## Features
- Connect to the Deriv API.
- Subscribe to market tick updates.
- Fetch active trading symbols.
- Retrieve contract details for specific symbols.
- Request price proposals for contracts.
- Execute buy orders for options contracts.
- Disconnect from the API when operations are complete.

---

## Prerequisites
1. **Node.js** (version 14 or later).
2. A **Deriv App ID**. You can create one by registering at [Deriv](https://deriv.com).

---

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/mayuran-deriv/options-rise-fall.git
   cd options-rise-fall
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage
1. Replace `'YOUR_APP_ID'` with your **Deriv App ID** in the example code.
2. Run the example script:
   ```bash
   node index.js
   ```
3. Monitor the console output to see API responses and logs.

---

## Code Overview

### 1. Initialize API Service
```javascript
const derivAPI = new DerivAPIService({
    app_id: 'YOUR_APP_ID'
});
```
Replace `'YOUR_APP_ID'` with your Deriv application ID.

### 2. Subscribe to Market Ticks
```javascript
await derivAPI.subscribeTicks('R_100');
```
Subscribes to live tick updates for the symbol `R_100`.

### 3. Fetch Active Symbols
```javascript
const symbols = await derivAPI.getActiveSymbols();
```
Retrieves all active trading symbols available.

### 4. Get Contracts for a Symbol
```javascript
const contracts = await derivAPI.getContractsForSymbol('R_100');
```
Fetches available contract types and details for symbol `R_100`.

### 5. Request Price Proposal
```javascript
const proposal = await derivAPI.getPriceProposal({
    proposal: 1,
    amount: 100,
    basis: 'stake',
    contract_type: 'CALL',
    currency: 'USD',
    duration: 5,
    duration_unit: 'min',
    symbol: 'R_100'
});
```
Requests a price proposal for a **CALL** contract with:
- **Amount**: $100
- **Duration**: 5 minutes
- **Currency**: USD

### 6. Buy Contract
```javascript
const buyResponse = await derivAPI.buyContract({
    buy: proposal.proposal!.id,
    price: 100
});
```
Purchases the proposed contract using the specified price.

### 7. Disconnect
```javascript
derivAPI.disconnect();
```
Closes the connection to the Deriv API.

---

## Notes
- Always ensure proper error handling and logging when working with real-time data and transactions.
- The example uses a demo account; do not use real funds without thorough testing.

---

## License
This project is licensed under the MIT License.

---

## Contact
For questions or support, please email: example@email.com

