import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { apiService } from '../services/api';

const { width, height } = Dimensions.get('window');

// Particle component for background effects
const Particle = ({ style, delay = 0 }: { style: any; delay?: number }) => {
  const particleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100 - Math.random() * 200],
  });

  const opacity = particleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Advanced animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const formScaleAnim = useRef(new Animated.Value(0.9)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const colorShiftAnim = useRef(new Animated.Value(0)).current;

  const { login, register } = useAuth();

  useEffect(() => {
    // Enhanced entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formScaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous advanced animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 25000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Color shift animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorShiftAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(colorShiftAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setIsLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const health = await apiService.healthCheck();
      console.log('Health check result:', health);
      Alert.alert('Backend Status', `Health check: ${health}`);
    } catch (error) {
      console.error('Backend test failed:', error);
      Alert.alert('Backend Error', error instanceof Error ? error.message : 'Connection failed');
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    Animated.timing(inputFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    Animated.timing(inputFocusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  const colorShift = colorShiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Generate particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <Particle
      key={i}
      style={[
        styles.particle,
        {
          left: Math.random() * width,
          top: height + Math.random() * 100,
          width: 2 + Math.random() * 4,
          height: 2 + Math.random() * 4,
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
        },
      ]}
      delay={i * 200}
    />
  ));

  return (
    <View style={styles.container}>
      {/* Dynamic Background Gradients */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <LinearGradient
        colors={[colors.gradients.secondary[0], colors.gradients.secondary[1]]}
        style={[styles.backgroundGradient, { opacity: 0.4 }]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Particle System */}
      {particles}

      {/* 3D Floating Elements with Parallax */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.element1,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim },
              { translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20],
              }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.element2,
          {
            transform: [
              { rotate: spinReverse },
              { scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.8],
              }) },
              { translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15],
              }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(236, 72, 153, 0.2)', 'rgba(59, 130, 246, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.element3,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }) },
              { translateY: parallaxAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -30],
              }) },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(16, 185, 129, 0.25)', 'rgba(59, 130, 246, 0.1)']}
          style={styles.floatingGradient}
        />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header Section */}
          <Animated.View 
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.logoWrapper}>
                <Text style={styles.logo}>🧗‍♀️</Text>
                <Animated.View
                  style={[
                    styles.logoGlow,
                    {
                      opacity: pulseAnim.interpolate({
                        inputRange: [1, 1.05],
                        outputRange: [0.3, 0.6],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.brandName}>ASCEND</Text>
            </Animated.View>
            <Text style={styles.tagline}>
              {isLogin ? 'Welcome back, climber!' : 'Join the climbing revolution'}
            </Text>
          </Animated.View>

          {/* Glassmorphism 2.0 Form Card */}
          <Animated.View
            style={[
              styles.formCardContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 30],
                  }) },
                  { scale: formScaleAnim },
                ],
              },
            ]}
          >
            <View style={styles.glassmorphismCard}>
              <View style={styles.cardContent}>
                <Title style={styles.formTitle}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Title>
                
                <View style={styles.inputContainer}>
                  <Animated.View style={[
                    styles.inputWrapper,
                    {
                      transform: [{ scale: inputFocusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      }) }],
                    },
                  ]}>
                    <TextInput
                      label="Email"
                      value={email}
                      onChangeText={setEmail}
                      mode="outlined"
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
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
                  </Animated.View>

                  <Animated.View style={[
                    styles.inputWrapper,
                    {
                      transform: [{ scale: inputFocusAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      }) }],
                    },
                  ]}>
                    <TextInput
                      label="Password"
                      value={password}
                      onChangeText={setPassword}
                      mode="outlined"
                      style={styles.input}
                      secureTextEntry={!showPassword}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      outlineColor="rgba(255, 255, 255, 0.3)"
                      activeOutlineColor="white"
                      right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
                          color="rgba(255, 255, 255, 0.7)"
                        />
                      }
                      theme={{
                        colors: {
                          placeholder: 'rgba(255, 255, 255, 0.7)',
                          text: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    />
                  </Animated.View>
                </View>

                <Animated.View style={{ 
                  transform: [
                    { scale: buttonPressAnim },
                    { scale: pulseAnim.interpolate({
                      inputRange: [1, 1.05],
                      outputRange: [1, 1.02],
                    }) },
                  ] 
                }}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
                      style={styles.submitGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.submitButtonText}>
                        {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>



                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsLogin(!isLogin)}
                    style={styles.switchButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.switchButtonText}>
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Enhanced Features Section */}
          <Animated.View 
            style={[
              styles.featuresContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.featuresTitle}>Why Ascend?</Text>
            <View style={styles.featuresGrid}>
              <Animated.View style={[styles.featureItem, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>📊</Text>
                </View>
                <Text style={styles.featureText}>Track Progress</Text>
              </Animated.View>
              <Animated.View style={[styles.featureItem, { transform: [{ scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }) }] }]}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>🎯</Text>
                </View>
                <Text style={styles.featureText}>Set Goals</Text>
              </Animated.View>
              <Animated.View style={[styles.featureItem, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.featureIconContainer}>
                  <Text style={styles.featureIcon}>🏆</Text>
                </View>
                <Text style={styles.featureText}>Celebrate Wins</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  floatingElement: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  element1: {
    top: height * 0.2,
    left: width * 0.3,
    backgroundColor: 'transparent',
  },
  element2: {
    bottom: height * 0.4,
    right: width * 0.2,
    backgroundColor: 'transparent',
  },
  element3: {
    top: height * 0.6,
    right: width * 0.4,
    backgroundColor: 'transparent',
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 100,
    opacity: 0.5,
  },
  particle: {
    position: 'absolute',
    borderRadius: 5,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoWrapper: {
    position: 'relative',
  },
  logo: {
    fontSize: 80,
    marginBottom: 8,
  },
  logoGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  formCardContainer: {
    marginBottom: 32,
  },
  glassmorphismCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    overflow: 'hidden',
  },
  cardContent: {
    padding: 32,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  submitGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  testButton: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  switchButton: {
    marginLeft: 4,
  },
  switchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  featuresContainer: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 40,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen; 