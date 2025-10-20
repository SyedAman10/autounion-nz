# Ngrok + CORS Troubleshooting Guide

## 🚨 Common Issue: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means your ngrok URL is returning **HTML instead of JSON**. This is usually a CORS or ngrok configuration issue.

---

## ✅ Solution Steps

### Step 1: Check Backend is Running

First, verify your backend is actually running:

```bash
# In your backend directory
node server.js
```

You should see output like:
```
✅ WhatsApp client initialized
🚀 Server running on port 3000
```

### Step 2: Test Backend Locally

Open your browser and go to:
```
http://localhost:3000/api/whatsapp/status
```

You should see JSON like:
```json
{
  "status": "OK",
  "connection": {
    "state": "DISCONNECTED",
    "isReady": false,
    "hasClient": true
  }
}
```

If this works, your backend is fine. The issue is with ngrok.

### Step 3: Configure CORS in Backend

Your backend needs to accept requests from ngrok. Add this to your `server.js`:

```javascript
const cors = require('cors');

// Add BEFORE your routes
app.use(cors({
  origin: '*', // Allow all origins (for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

// OR for production, specify your ngrok domain:
app.use(cors({
  origin: 'https://94d3d81323ca.ngrok-free.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
```

Make sure you have cors installed:
```bash
npm install cors
```

### Step 4: Check Ngrok Configuration

Your ngrok might have a warning page. To fix this:

#### Option A: Use ngrok-skip-browser-warning header

Update your frontend to add this header (I'll do this for you in the next update):

```javascript
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
}
```

#### Option B: Upgrade Ngrok (Recommended)

Free ngrok has limitations. Consider:
1. Sign up at https://ngrok.com
2. Get your auth token
3. Run: `ngrok config add-authtoken YOUR_TOKEN`
4. Restart ngrok: `ngrok http 3000`

### Step 5: Test Ngrok URL

Open your ngrok URL in a new browser tab:
```
https://94d3d81323ca.ngrok-free.app/api/whatsapp/status
```

**What you should see:**
- ✅ JSON data: `{"status":"OK",...}` - GOOD!
- ❌ HTML warning page - Need to add skip-browser-warning header
- ❌ Error page - Check backend and CORS

---

## 🔧 Quick Fix: Add Skip Browser Warning Header

Let me update the code to add this header automatically...

