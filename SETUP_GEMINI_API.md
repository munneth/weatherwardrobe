# Setting Up Gemini API Key

## The Issue
You're getting the error "AI service not available" because the Gemini API key is not configured.

## How to Fix It

### Step 1: Get a Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Create Environment File
Create a file called `.env.local` in your project root (same folder as `package.json`) with this content:

```env
# Google Gemini API Key
gemini_api_key=your_actual_api_key_here

# Weather API Key (if you have one)
key=your_weather_api_key_here
```

**Important**: Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### Step 3: Restart Your Development Server
After creating the `.env.local` file:

1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again
3. The API key will now be loaded

### Step 4: Test the AI Image Generation
1. Go to `/ai-image-test` in your browser
2. Try generating an image
3. It should now work without the "AI service not available" error

## What Happens Without the API Key
- The app will still work
- It will use placeholder images from Unsplash
- You'll see warning messages in the console
- The AI features won't be available

## Troubleshooting

### If you still get errors:
1. **Check the file name**: Make sure it's exactly `.env.local` (not `.env`)
2. **Check the variable name**: Make sure it's exactly `gemini_api_key`
3. **Restart the server**: Environment variables are only loaded when the server starts
4. **Check the API key**: Make sure you copied the entire key correctly

### If the API key doesn't work:
1. **Check your quota**: Free tier has limits
2. **Check the region**: Some features may not be available in all regions
3. **Check the model**: Make sure you're using supported models

## Example .env.local File
```env
# Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
gemini_api_key=AIzaSyC_1234567890abcdefghijklmnopqrstuvwxyz

# Weather API Key (optional)
key=your_weather_api_key_here
```

## Security Note
- Never commit your `.env.local` file to git
- The `.gitignore` file should already exclude it
- Keep your API key private and secure 