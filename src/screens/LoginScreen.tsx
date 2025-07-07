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
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { login, register } = useAuth();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 20000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spinReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Gradients */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={[colors.gradients.secondary[0], colors.gradients.secondary[1]]}
        style={[styles.backgroundGradient, { opacity: 0.3 }]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Floating Elements */}
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle1,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle2,
          {
                         transform: [
               { rotate: spinReverse },
               { scale: pulseAnim.interpolate({
                 inputRange: [0, 1],
                 outputRange: [1, 0.8],
               }) },
             ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle,
          styles.circle3,
          {
            transform: [
              { rotate: spin },
              { scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              }) },
            ],
          },
        ]}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
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
              <Text style={styles.logo}>🧗‍♀️</Text>
              <Text style={styles.brandName}>ASCEND</Text>
            </Animated.View>
            <Text style={styles.tagline}>
              {isLogin ? 'Welcome back, climber!' : 'Join the climbing revolution'}
            </Text>
          </Animated.View>

          {/* Glassmorphism Form Card */}
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
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Card style={styles.formCard}>
              <Card.Content style={styles.formContent}>
                <Title style={styles.formTitle}>
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Title>
                
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
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

                  <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    outlineColor="rgba(255, 255, 255, 0.3)"
                    activeOutlineColor="white"
                                          right={
                        <TextInput.Icon
                          icon={showPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowPassword(!showPassword)}
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
                </View>

                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    loading={isLoading}
                    disabled={isLoading}
                    buttonColor="white"
                    textColor={colors.primary}
                    labelStyle={styles.submitButtonLabel}
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </Animated.View>

                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <Button
                    mode="text"
                    onPress={() => setIsLogin(!isLogin)}
                    style={styles.switchButton}
                    textColor="white"
                    labelStyle={styles.switchButtonLabel}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Features Section */}
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
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureText}>Track Progress</Text>
              </Animated.View>
              <Animated.View style={[styles.featureItem, { transform: [{ scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1],
              }) }] }]}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Set Goals</Text>
              </Animated.View>
              <Animated.View style={[styles.featureItem, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.featureIcon}>🏆</Text>
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
  floatingCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: 100,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: height * 0.3,
    right: 50,
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
  logo: {
    fontSize: 80,
    marginBottom: 8,
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
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  formContent: {
    padding: 32,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    borderRadius: 12,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  switchButton: {
    marginLeft: -8,
  },
  switchButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  featureIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen; 