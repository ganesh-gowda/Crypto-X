# Network Error Troubleshooting Guide

## Issue: "Network Error" on Currency/Market Page

### ✅ Fixes Applied:

1. **Rate Limiting Protection**
   - Added 1-second delay between API calls
   - Prevents hitting CoinGecko rate limits

2. **Automatic Retry Logic**
   - Retries failed requests up to 3 times
   - Exponential backoff (1s, 2s, 4s delays)

3. **Better Error Messages**
   - Shows specific error types:
     - Timeout errors
     - Rate limiting (429 errors)
     - Server errors (500+)
     - Connection errors

4. **Increased Timeouts**
   - Extended API timeout to 15 seconds
   - Better handling for slow connections

5. **WebSocket Error Handling**
   - Graceful handling of WebSocket connection errors
   - Won't break the app if backend is offline

---

## Common Causes & Solutions

### 1. CoinGecko API Rate Limiting
**Symptoms**: Error says "Too many requests"
**Solution**: 
- Wait 1-2 minutes
- The app will auto-retry
- Free API has ~10-50 calls/minute limit

### 2. Internet Connection Issues
**Symptoms**: "Request timeout" or "Network Error"
**Solution**:
- Check your internet connection
- Refresh the page
- Click "Try Again" button

### 3. CoinGecko API Down
**Symptoms**: "API is currently unavailable"
**Solution**:
- Wait a few minutes
- Check CoinGecko status: https://status.coingecko.com/
- The API will usually recover quickly

### 4. WebSocket Connection Failed
**Symptoms**: Console shows "WebSocket connection error"
**Solution**:
- Make sure backend server is running on port 5000
- Check if `npm run server` is active
- WebSocket is optional - app works without it

---

## How to Test the Fixes

1. **Open Browser Console** (F12)
2. **Navigate to Market page** (http://localhost:5174/market)
3. **Check Console Logs**:
   - ✅ "WebSocket connected" = WebSocket working
   - ⚠️ "WebSocket connection error" = Backend offline (OK, app still works)
   - 📡 API calls should show in Network tab

4. **If Error Appears**:
   - Note the specific error message
   - Click "Try Again" button
   - Wait for auto-retry (shows "Retrying... 1/3")

---

## Debug Commands

### Check if Backend is Running:
```powershell
# In terminal, run:
cd "f:/PROJECTS/Crypto/Crypto-X"
npm run server
```

Should see:
```
Server running on port 5000
WebSocket server running on ws://localhost:5000
MongoDB Connected: ...
```

### Check if Frontend is Running:
```powershell
# In another terminal, run:
cd "f:/PROJECTS/Crypto/Crypto-X"
npm run dev
```

Should see:
```
VITE v4.4.11  ready in ...ms
Local:   http://localhost:5173/  (or 5174)
```

### Run Both Servers:
```powershell
# Use the combined command:
npm run dev:all
```

---

## API Rate Limits (Free Tier)

| API | Rate Limit | Notes |
|-----|-----------|-------|
| CoinGecko | 10-50 calls/min | Main crypto data API |
| RapidAPI (News) | Varies | Check your plan |

### Tips to Avoid Rate Limits:
- Don't refresh pages too quickly
- Wait 1-2 seconds between navigation
- App automatically rate-limits requests now
- Consider caching data for production

---

## If Nothing Works

1. **Clear Browser Cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cached images and files
   - Reload page

2. **Check CoinGecko Status**:
   - Visit: https://www.coingecko.com/
   - If main site is slow, API is likely overloaded

3. **Test API Directly**:
   ```
   https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1
   ```
   - Paste in browser
   - Should return JSON data
   - If error, CoinGecko is having issues

4. **Restart Both Servers**:
   - Stop all terminals (Ctrl + C)
   - Close VS Code terminals
   - Restart: `npm run dev:all`

---

## Production Recommendations

For a production app, consider:

1. **Paid API Key**
   - CoinGecko Pro API
   - Higher rate limits
   - Better reliability

2. **API Caching**
   - Cache responses for 30-60 seconds
   - Reduces API calls significantly
   - Use Redis or memory cache

3. **Backup APIs**
   - CoinMarketCap API
   - Cryptocompare API
   - Fallback if one fails

4. **Error Monitoring**
   - Sentry.io for error tracking
   - Monitor API failures
   - Alert on high error rates

---

## Current Status

✅ **Fixed Issues:**
- Rate limiting protection added
- Better error messages
- Automatic retry logic
- WebSocket error handling
- Increased timeouts

🔄 **App Should Now:**
- Handle network errors gracefully
- Auto-retry failed requests
- Show helpful error messages
- Continue working if WebSocket fails

---

## Need More Help?

Check browser console (F12) for detailed error logs. The improved error messages will tell you exactly what's wrong!
