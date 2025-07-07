# 🌤️ Weather Feature Setup

## Getting Your OpenWeatherMap API Key

1. **Sign up for a free account** at [OpenWeatherMap](https://openweathermap.org/api)
2. **Go to your API keys** section in your account
3. **Copy your API key** (it will look like: `1234567890abcdef1234567890abcdef`)
4. **Replace the placeholder** in `src/services/weatherService.ts`:
   ```typescript
   const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

## Features Included

✅ **Current Location Weather** - Automatically gets weather for user's location  
✅ **City Search** - Search weather for any city worldwide  
✅ **Climbing Conditions Assessment** - Smart analysis of weather for climbing  
✅ **Personalized Recommendations** - Tips based on current conditions  
✅ **Beautiful UI** - Matches your app's stunning design  

## Weather Logic

The app considers these factors for climbing conditions:
- **Temperature**: 10-25°C (50-77°F) is ideal
- **Humidity**: Below 70% for better grip
- **Wind**: Below 20 km/h for safety
- **Precipitation**: No rain/snow for outdoor climbing

## Free Tier Limits

- **1,000 API calls per day** (more than enough for personal use)
- **Real-time weather data**
- **Global coverage**

## Next Steps

1. Get your API key from OpenWeatherMap
2. Update the `API_KEY` in the weather service
3. Test the weather feature in your app
4. Enjoy checking climbing conditions! 🧗‍♀️ 