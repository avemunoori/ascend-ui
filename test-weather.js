const axios = require('axios');
require('dotenv').config();

async function testWeatherAPI() {
  console.log('🌤️ Testing Weather API...\n');
  
  const API_KEY = process.env.WEATHER_API_KEY;
  const BASE_URL = process.env.WEATHER_API_BASE_URL;
  
  console.log('Environment Variables:');
  console.log(`API Key: ${API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`Base URL: ${BASE_URL || '❌ Missing'}\n`);
  
  if (!API_KEY) {
    console.error('❌ WEATHER_API_KEY not found in environment variables');
    return;
  }
  
  const cities = [
    'San Francisco',
    'Boulder, Colorado',
    'Yosemite Valley',
    'Joshua Tree'
  ];
  
  for (const city of cities) {
    try {
      console.log(`📍 Testing with ${city}...`);
      const response = await axios.get(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
      );
      
      const data = response.data;
      console.log('✅ API Response Success!');
      console.log(`📍 Location: ${data.location.name}, ${data.location.country}`);
      console.log(`🌡️ Temperature: ${data.current.temp_c}°C`);
      console.log(`💧 Humidity: ${data.current.humidity}%`);
      console.log(`💨 Wind: ${data.current.wind_kph} km/h`);
      console.log(`☁️ Condition: ${data.current.condition.text}`);
      
      // Test climbing conditions assessment
      const temp = data.current.temp_c;
      const humidity = data.current.humidity;
      const windSpeed = data.current.wind_kph;
      const description = data.current.condition.text;
      
      const isGoodTemp = temp >= 10 && temp <= 25;
      const isGoodHumidity = humidity < 70;
      const isGoodWind = windSpeed < 20;
      const isGoodWeather = !description.toLowerCase().includes('rain') && 
                           !description.toLowerCase().includes('snow') &&
                           !description.toLowerCase().includes('storm');
      
      const isGoodForClimbing = isGoodTemp && isGoodHumidity && isGoodWind && isGoodWeather;
      
      console.log('🧗‍♀️ Climbing Conditions:');
      console.log(`Temperature (10-25°C): ${isGoodTemp ? '✅' : '❌'} (${temp}°C)`);
      console.log(`Humidity (<70%): ${isGoodHumidity ? '✅' : '❌'} (${humidity}%)`);
      console.log(`Wind (<20 km/h): ${isGoodWind ? '✅' : '❌'} (${windSpeed} km/h)`);
      console.log(`Weather (no rain/snow): ${isGoodWeather ? '✅' : '❌'} (${description})`);
      console.log(`Overall: ${isGoodForClimbing ? '✅ Perfect for climbing!' : '❌ Not ideal for climbing'}`);
      console.log('─'.repeat(50) + '\n');
      
    } catch (error) {
      console.error(`❌ Failed to get weather for ${city}:`);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Error: ${error.response.data.error?.message || error.response.data}`);
      } else {
        console.error(`Error: ${error.message}`);
      }
      console.log('─'.repeat(50) + '\n');
    }
  }
}

testWeatherAPI(); 