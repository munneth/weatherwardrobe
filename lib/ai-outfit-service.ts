// AI Outfit Generation Service
// Replace the endpoint and key with your real values

export async function generateOutfitsWithImages(weather, user) {
  const apiKey = process.env.AI_OUTFIT_API_KEY; // Set this in your .env
  const endpoint = process.env.AI_OUTFIT_API_URL || 'https://your-ai-api-endpoint.com/generate-outfits';

  if (!apiKey) throw new Error('Missing AI_OUTFIT_API_KEY in .env');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        weather,
        userId: user?.uid || null
      })
    });
    if (!response.ok) throw new Error('AI API error: ' + response.statusText);
    const data = await response.json();
    // Expecting: [{ items: [...], imageUrl: '...' }, ...]
    return data.outfits;
  } catch (err) {
    console.error('AI outfit API error:', err);
    throw err;
  }
} 