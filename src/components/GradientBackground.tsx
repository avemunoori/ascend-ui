import React from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface GradientBackgroundProps {
  children: React.ReactNode;
  gradient?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: any;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  gradient = colors.gradients.primary,
  style,
}) => {
  return (
    <LinearGradient
      colors={gradient as readonly [ColorValue, ColorValue, ...ColorValue[]]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground; 