# Remaining API URL Updates

## ✅ Already Updated Files
- ✓ `src/context/AuthContext.jsx`
- ✓ `src/services/userApi.js`
- ✓ `src/services/transactionApi.js`
- ✓ `src/context/SocketContext.jsx`
- ✓ `src/pages/Analytics.jsx`

## 📝 Files Still Need Manual Updates

### 1. src/components/GlobalSearchBar.jsx
Replace all instances of `'http://localhost:5000/api/search/...'` with API_ENDPOINTS:

```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Line ~42: Replace
axios.get('http://localhost:5000/api/search/watchlist', ...)
// With:
axios.get(API_ENDPOINTS.SEARCH_WATCHLIST, ...)

// Line ~56: Replace
axios.get('http://localhost:5000/api/search/filters', ...)
// With:
axios.get(API_ENDPOINTS.SEARCH_FILTERS, ...)

// Line ~78: Replace
`http://localhost:5000/api/search/global?${params.toString()}`
// With:
`${API_ENDPOINTS.SEARCH_GLOBAL}?${params.toString()}`

// Line ~125: Replace
axios.delete(`http://localhost:5000/api/search/watchlist/${coin.id}`, ...)
// With:
axios.delete(`${API_ENDPOINTS.SEARCH_WATCHLIST}/${coin.id}`, ...)

// Line ~129: Replace
axios.post('http://localhost:5000/api/search/watchlist', ...)
// With:
axios.post(API_ENDPOINTS.SEARCH_WATCHLIST, ...)

// Line ~157: Replace
axios.post('http://localhost:5000/api/search/filters', ...)
// With:
axios.post(API_ENDPOINTS.SEARCH_FILTERS, ...)

// Line ~182: Replace
axios.delete(`http://localhost:5000/api/search/filters/${filterId}`, ...)
// With:
axios.delete(`${API_ENDPOINTS.SEARCH_FILTERS}/${filterId}`, ...)
```

### 2. src/components/ExportReports.jsx
Replace all instances of `'http://localhost:5000/api/reports/...'` with API_ENDPOINTS:

```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Line ~20: Replace
axios.get('http://localhost:5000/api/reports/portfolio-data', ...)
// With:
axios.get(API_ENDPOINTS.REPORTS_PORTFOLIO, ...)

// Line ~117: Replace
axios.get('http://localhost:5000/api/reports/transactions-csv', ...)
// With:
axios.get(API_ENDPOINTS.REPORTS_TRANSACTIONS_CSV, ...)

// Line ~155: Replace
axios.get('http://localhost:5000/api/reports/alerts-csv', ...)
// With:
axios.get(API_ENDPOINTS.REPORTS_ALERTS_CSV, ...)

// Line ~198: Replace
axios.get(`http://localhost:5000/api/reports/tax-report?year=${selectedYear}`, ...)
// With:
axios.get(`${API_ENDPOINTS.REPORTS_TAX}?year=${selectedYear}`, ...)
```

### 3. src/pages/VerifyEmail.jsx
```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Line ~24: Replace
axios.post('http://localhost:5000/api/verify/confirm', ...)
// With:
axios.post(API_ENDPOINTS.VERIFY_CONFIRM, ...)
```

### 4. src/components/VerificationBanner.jsx
```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Line ~27: Replace
'http://localhost:5000/api/verify/send'
// With:
API_ENDPOINTS.VERIFY_SEND
```

### 5. src/pages/TwoFactorSettings.jsx
```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Replace all 6 instances:
'http://localhost:5000/api/2fa/status' → API_ENDPOINTS.TWO_FACTOR_STATUS
'http://localhost:5000/api/2fa/backup-codes' → API_ENDPOINTS.TWO_FACTOR_BACKUP_CODES
'http://localhost:5000/api/2fa/setup' → API_ENDPOINTS.TWO_FACTOR_SETUP
'http://localhost:5000/api/2fa/verify' → API_ENDPOINTS.TWO_FACTOR_VERIFY
'http://localhost:5000/api/2fa/disable' → API_ENDPOINTS.TWO_FACTOR_DISABLE
'http://localhost:5000/api/2fa/regenerate-backup-codes' → API_ENDPOINTS.TWO_FACTOR_REGENERATE_CODES
```

### 6. src/components/TwoFactorModal.jsx
```javascript
// Add import at top
import { API_ENDPOINTS } from '../config/apiConfig';

// Replace 2 instances:
'http://localhost:5000/api/2fa/verify-login' → API_ENDPOINTS.TWO_FACTOR_VERIFY_LOGIN
'http://localhost:5000/api/auth/login-2fa' → API_ENDPOINTS.TWO_FACTOR_LOGIN
```

---

## 🚀 Quick Update Commands (VS Code)

You can use Find & Replace (Ctrl+H) in VS Code:

1. **Find:** `'http://localhost:5000/api/search/watchlist'`
   **Replace:** `API_ENDPOINTS.SEARCH_WATCHLIST`

2. **Find:** `'http://localhost:5000/api/search/filters'`
   **Replace:** `API_ENDPOINTS.SEARCH_FILTERS`

3. **Find:** `'http://localhost:5000/api/search/global`
   **Replace:** `API_ENDPOINTS.SEARCH_GLOBAL`

4. **Find:** `'http://localhost:5000/api/reports/`
   **Replace:** `API_ENDPOINTS.REPORTS_` (adjust suffix as needed)

5. **Find:** `'http://localhost:5000/api/verify/`
   **Replace:** `API_ENDPOINTS.VERIFY_` (adjust suffix as needed)

6. **Find:** `'http://localhost:5000/api/2fa/`
   **Replace:** `API_ENDPOINTS.TWO_FACTOR_` (adjust suffix as needed)

---

## ⚡ OR Use This Automated Script

Create a new file `update-all-urls.js` in project root and run it:

```javascript
// update-all-urls.js
const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'src/components/GlobalSearchBar.jsx',
    replacements: [
      ["'http://localhost:5000/api/search/watchlist'", "API_ENDPOINTS.SEARCH_WATCHLIST"],
      ["'http://localhost:5000/api/search/filters'", "API_ENDPOINTS.SEARCH_FILTERS"],
      ["`http://localhost:5000/api/search/global", "`${API_ENDPOINTS.SEARCH_GLOBAL}"],
      ["`http://localhost:5000/api/search/watchlist/${", "`${API_ENDPOINTS.SEARCH_WATCHLIST}/${"],
      ["`http://localhost:5000/api/search/filters/${", "`${API_ENDPOINTS.SEARCH_FILTERS}/${"]
    ]
  },
  // Add more files here...
];

// Run replacements
replacements.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(([find, replace]) => {
    content = content.replace(new RegExp(find, 'g'), replace);
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated ${file}`);
});
```

---

## 📝 Summary

**Total files to update:** 11
**Already updated:** 5
**Remaining:** 6

Once all files are updated, your app will work seamlessly in both development (localhost) and production (Vercel + Render)!
