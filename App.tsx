import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { SessionsProvider } from './src/contexts/SessionsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <SessionsProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </SessionsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
