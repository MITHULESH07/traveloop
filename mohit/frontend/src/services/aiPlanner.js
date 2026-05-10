// This service calls the Gemini API to generate real, dynamic options for a travel planner
export const generateTripOptions = async (destination, budget, startDate, endDate, preferences) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const prompt = `
    You are an expert travel planner backend. I need a massive list of realistic hotels and activities for a multi-city or single-city trip.
    Destinations requested: ${destination}
    Duration: ${days} days
    Total Budget: $${budget}
    Preferences/Wishes: ${preferences}
    
    You must provide realistic data. Find real names for hotels/inns and activities/restaurants.
    If multiple cities are in the destination (e.g. "Chennai, Tiruppur"), provide hotels and activities for EACH city.
    
    Return the response strictly as a valid JSON object with the following structure:
    {
      "hotels": [
        {
          "id": "h1",
          "name": "Realistic Hotel Name",
          "city": "Specific City Name",
          "pricePerNight": 100,
          "rating": 4.5,
          "distanceFromCenter": "2 km",
          "description": "A beautiful stay near the city center.",
          "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"
        }
      ],
      "activities": [
        {
          "id": "a1",
          "name": "Realistic Activity or Restaurant Name",
          "city": "Specific City Name",
          "cost": 50,
          "duration": "2 hours",
          "distanceFromHotel": "5 km",
          "description": "An amazing experience.",
          "type": "Activity", 
          "category": "Adventure", // Must be one of: "Food", "Adventure", "Viewpoint", "Culture", "Beach", "Relaxation"
          "image": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=500&q=80"
        }
      ]
    }
    
    CRITICAL: Provide at least 4 hotel options (spread across the cities if multiple).
    CRITICAL: Provide at least 15 activity options ranging across all categories (Food, Adventure, Viewpoint, Culture, etc.) spread across the cities.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await response.json();
    const textResponse = data.candidates[0].content.parts[0].text;
    
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
