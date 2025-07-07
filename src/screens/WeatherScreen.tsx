import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { weatherService, WeatherData } from '../services/weatherService';

const { width, height } = Dimensions.get('window');

const WeatherScreen: React.FC = () => {
  const navigation = useNavigation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Get current location on mount
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get weather for your current location.');
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Get weather data
      const weather = await weatherService.getWeatherForLocation(latitude, longitude);
      setWeatherData(weather);

      // Get city name from coordinates
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geocode.length > 0) {
        const city = geocode[0].city || geocode[0].region || 'Current Location';
        setCurrentLocation(city);
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to get current location weather');
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchWeather = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      const weather = await weatherService.getWeatherForCity(location.trim());
      setWeatherData(weather);
      setCurrentLocation(location.trim());
    } catch (error) {
      Alert.alert('Error', 'City not found or weather data unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '🌤️';
  };

  const getConditionColor = (isGood: boolean) => {
    return isGood ? '#4CAF50' : '#F44336';
  };

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🌤️</Text>
            <Title style={styles.headerTitle}>Climbing Weather</Title>
            <Text style={styles.headerSubtitle}>
              Check conditions for your next outdoor session
            </Text>
          </View>

          {/* Search Section */}
          <Card style={styles.searchCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.cardGradient}
            >
              <Card.Content style={styles.searchContent}>
                <Title style={styles.searchTitle}>📍 Search Location</Title>
                <View style={styles.searchRow}>
                  <TextInput
                    placeholder="Enter city name..."
                    value={location}
                    onChangeText={setLocation}
                    style={styles.searchInput}
                    mode="outlined"
                    outlineColor="rgba(255, 255, 255, 0.3)"
                    activeOutlineColor="white"
                    theme={{
                      colors: {
                        placeholder: 'rgba(255, 255, 255, 0.7)',
                        text: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                  <Button
                    mode="contained"
                    onPress={searchWeather}
                    disabled={loading}
                    style={styles.searchButton}
                    buttonColor="white"
                    textColor={colors.primary}
                  >
                    Search
                  </Button>
                </View>
                <Button
                  mode="outlined"
                  onPress={getCurrentLocation}
                  disabled={loading}
                  style={styles.locationButton}
                  textColor="white"
                  labelStyle={{ color: 'white' }}
                >
                  📍 Use Current Location
                </Button>
              </Card.Content>
            </LinearGradient>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card style={styles.loadingCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.cardGradient}
              >
                <Card.Content style={styles.loadingContent}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Getting weather data...</Text>
                </Card.Content>
              </LinearGradient>
            </Card>
          )}

          {/* Weather Data */}
          {weatherData && !loading && (
            <>
              {/* Current Location */}
              <Card style={styles.weatherCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.cardGradient}
                >
                  <Card.Content style={styles.weatherContent}>
                    <View style={styles.locationHeader}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Title style={styles.locationTitle}>{currentLocation}</Title>
                    </View>

                    {/* Main Weather Display */}
                    <View style={styles.mainWeather}>
                      <Animated.View style={[styles.weatherIcon, { transform: [{ scale: pulseAnim }] }]}>
                        <Text style={styles.weatherEmoji}>
                          {getWeatherIcon(weatherData.icon)}
                        </Text>
                      </Animated.View>
                      <View style={styles.temperatureContainer}>
                        <Text style={styles.temperature}>
                          {Math.round(weatherData.temperature)}°C
                        </Text>
                        <Text style={styles.description}>
                          {weatherData.description}
                        </Text>
                      </View>
                    </View>

                    {/* Climbing Recommendation */}
                    <View style={styles.recommendationContainer}>
                      <Chip
                        mode="outlined"
                        style={[
                          styles.recommendationChip,
                          { borderColor: getConditionColor(weatherData.isGoodForClimbing) }
                        ]}
                        textStyle={[
                          styles.recommendationText,
                          { color: getConditionColor(weatherData.isGoodForClimbing) }
                        ]}
                      >
                        {weatherData.isGoodForClimbing ? '✅' : '⚠️'} {weatherData.climbingRecommendation}
                      </Chip>
                    </View>

                    {/* Weather Details */}
                    <View style={styles.weatherDetails}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Feels Like</Text>
                        <Text style={styles.detailValue}>
                          {Math.round(weatherData.feelsLike)}°C
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>
                          {weatherData.humidity}%
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Wind Speed</Text>
                        <Text style={styles.detailValue}>
                          {weatherData.windSpeed} km/h
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </LinearGradient>
              </Card>

              {/* Climbing Tips */}
              <Card style={styles.tipsCard}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.cardGradient}
                >
                  <Card.Content style={styles.tipsContent}>
                    <Title style={styles.tipsTitle}>🧗‍♀️ Climbing Tips</Title>
                    <View style={styles.tipsList}>
                      <Text style={styles.tipText}>
                        • {weatherData.isGoodForClimbing 
                          ? 'Perfect conditions! Consider outdoor climbing today.'
                          : 'Consider indoor climbing or wait for better conditions.'
                        }
                      </Text>
                      <Text style={styles.tipText}>
                        • {weatherData.temperature < 15 
                          ? 'Bring warm layers and consider warming up indoors first.'
                          : weatherData.temperature > 25
                          ? 'Stay hydrated and take frequent breaks in the shade.'
                          : 'Temperature is ideal for climbing!'
                        }
                      </Text>
                      <Text style={styles.tipText}>
                        • {weatherData.humidity > 60 
                          ? 'High humidity may affect grip. Consider chalk or different holds.'
                          : 'Low humidity is great for grip!'
                        }
                      </Text>
                    </View>
                  </Card.Content>
                </LinearGradient>
              </Card>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  searchCard: {
    marginBottom: 24,
    elevation: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 16,
  },
  searchContent: {
    padding: 24,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
    borderRadius: 12,
  },
  searchButton: {
    borderRadius: 12,
    elevation: 4,
  },
  locationButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
  },
  loadingCard: {
    marginBottom: 24,
    elevation: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  loadingContent: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
  weatherCard: {
    marginBottom: 24,
    elevation: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  weatherContent: {
    padding: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  weatherIcon: {
    marginRight: 20,
  },
  weatherEmoji: {
    fontSize: 80,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  recommendationContainer: {
    marginBottom: 24,
  },
  recommendationChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
  },
  recommendationText: {
    fontWeight: '700',
    fontSize: 14,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  tipsCard: {
    marginBottom: 24,
    elevation: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  tipsContent: {
    padding: 24,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontWeight: '500',
  },
});

export default WeatherScreen; 