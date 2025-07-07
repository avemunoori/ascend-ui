import axios from 'axios';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '@env';

// WeatherAPI.com - Free tier allows 1,000,000 calls/month
const API_KEY = WEATHER_API_KEY;
const BASE_URL = WEATHER_API_BASE_URL;

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  isGoodForClimbing: boolean;
  climbingRecommendation: string;
}

export interface LocationData {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

class WeatherService {
  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`
      );

      const data = response.data;
      const current = data.current;
      const location = data.location;
      
      const temp = current.temp_c;
      const humidity = current.humidity;
      const windSpeed = current.wind_kph;
      const description = current.condition.text;
      const icon = current.condition.icon;

      // Determine if weather is good for climbing
      const isGoodForClimbing = this.assessClimbingConditions(temp, humidity, windSpeed, description);
      const climbingRecommendation = this.getClimbingRecommendation(temp, humidity, windSpeed, description);

      return {
        temperature: temp,
        feelsLike: current.feelslike_c,
        humidity,
        windSpeed,
        description,
        icon,
        isGoodForClimbing,
        climbingRecommendation,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private assessClimbingConditions(
    temp: number,
    humidity: number,
    windSpeed: number,
    description: string
  ): boolean {
    // Ideal climbing conditions:
    // - Temperature: 10-25°C (50-77°F)
    // - Humidity: < 70%
    // - Wind: < 20 km/h
    // - No rain/snow
    
    const isGoodTemp = temp >= 10 && temp <= 25;
    const isGoodHumidity = humidity < 70;
    const isGoodWind = windSpeed < 20;
    const isGoodWeather = !description.toLowerCase().includes('rain') && 
                         !description.toLowerCase().includes('snow') &&
                         !description.toLowerCase().includes('storm');

    return isGoodTemp && isGoodHumidity && isGoodWind && isGoodWeather;
  }

  private getClimbingRecommendation(
    temp: number,
    humidity: number,
    windSpeed: number,
    description: string
  ): string {
    if (this.assessClimbingConditions(temp, humidity, windSpeed, description)) {
      return "Perfect climbing conditions! 🧗‍♀️";
    }

    const issues = [];
    if (temp < 10) issues.push("too cold");
    if (temp > 25) issues.push("too hot");
    if (humidity >= 70) issues.push("high humidity");
    if (windSpeed >= 20) issues.push("windy");
    if (description.toLowerCase().includes('rain')) issues.push("rainy");
    if (description.toLowerCase().includes('snow')) issues.push("snowy");

    return `Not ideal for climbing: ${issues.join(', ')} ⚠️`;
  }

  async getWeatherForLocation(lat: number, lon: number): Promise<WeatherData> {
    return this.getWeatherData(lat, lon);
  }

  async getWeatherForCity(city: string): Promise<WeatherData> {
    try {
      // WeatherAPI.com can handle city names directly
      const response = await axios.get(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`
      );

      const data = response.data;
      const current = data.current;
      
      const temp = current.temp_c;
      const humidity = current.humidity;
      const windSpeed = current.wind_kph;
      const description = current.condition.text;
      const icon = current.condition.icon;

      // Determine if weather is good for climbing
      const isGoodForClimbing = this.assessClimbingConditions(temp, humidity, windSpeed, description);
      const climbingRecommendation = this.getClimbingRecommendation(temp, humidity, windSpeed, description);

      return {
        temperature: temp,
        feelsLike: current.feelslike_c,
        humidity,
        windSpeed,
        description,
        icon,
        isGoodForClimbing,
        climbingRecommendation,
      };
    } catch (error) {
      console.error('Error fetching weather for city:', error);
      throw new Error('City not found or weather data unavailable');
    }
  }
}

export const weatherService = new WeatherService(); 