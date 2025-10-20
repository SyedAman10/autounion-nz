# Gemini AI Setup Guide

This application uses Google's Gemini AI for intelligent document validation and data extraction.

## Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Configure the Application

### Option 1: Environment Variable (Recommended)

Create a file named `.env.local` in the `autounion` directory:

```env
# Required: Your Gemini API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here

# Optional: Choose which model to use
# Options: gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro, gemini-pro-vision
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash-exp
```

**Available Models:**
- `gemini-2.0-flash-exp` - Latest experimental model (Default, recommended)
- `gemini-1.5-flash` - Stable and fast, good for production
- `gemini-1.5-pro` - Best quality, but slower and more expensive
- `gemini-pro-vision` - Optimized specifically for image analysis

### Option 2: Direct Configuration

Edit `src/app/page.js` and replace:

```javascript
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
```

With:

```javascript
const GEMINI_API_KEY = 'your_actual_api_key_here';
```

## Features

The Gemini AI integration provides:

✅ **Intelligent Document Validation**
- Accurately detects if an image is a driving license or passport
- Rejects tickets, receipts, and other invalid documents
- Provides reasons for rejection

✅ **Smart Data Extraction**
- Extracts license numbers from driving licenses
- Extracts passport numbers from passports
- Handles various document formats and layouts

✅ **Auto-Fill Functionality**
- Automatically fills in license and passport number fields
- Validates extracted data before submission

## API Usage

- The API is free for moderate usage
- Check [pricing](https://ai.google.dev/pricing) for limits
- Typical usage: ~2-3 API calls per check-in (one for each document)

## Troubleshooting

**Error: "Failed to process document"**
- Check that your API key is correctly configured
- Ensure you have an active internet connection
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

**Document not being recognized**
- Ensure image is clear and well-lit
- Image should be in JPG or PNG format
- Document should be fully visible in the photo

## Training Data (Optional)

If you want to improve accuracy with your specific document formats:

1. Collect 4-5 sample images of valid documents
2. Test the current system with them
3. If needed, we can fine-tune the prompts for better accuracy

Contact support if you need assistance with custom document formats.

