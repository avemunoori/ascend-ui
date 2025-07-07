import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { Session } from '../types';
import { useAuth } from './AuthContext';

interface SessionsContextType {
  sessions: Session[];
  loading: boolean;
  refreshSessions: () => Promise<void>;
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined);

export const useSessions = () => {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
};

interface SessionsProviderProps {
  children: React.ReactNode;
}

export const SessionsProvider: React.FC<SessionsProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshSessions = async () => {
    if (!user) {
      setSessions([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await apiService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to refresh sessions:', error);
      // Don't show error if user is not authenticated yet
      if (error instanceof Error && error.message.includes('401')) {
        setSessions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshSessions();
    } else {
      setSessions([]);
    }
  }, [user]);

  const value = {
    sessions,
    loading,
    refreshSessions,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}; 