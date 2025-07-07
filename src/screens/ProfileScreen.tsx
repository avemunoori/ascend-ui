import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  List,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.email || '')}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>Climber</Title>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Text style={styles.profileDate}>
              Member since {user ? formatDate(user.createdAt) : ''}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Your Climbing Journey</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🧗‍♀️</Text>
              <Text style={styles.statLabel}>Climbing</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>📈</Text>
              <Text style={styles.statLabel}>Progress</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>🎯</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>About Ascend</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Backend API"
            description="Spring Boot"
            left={(props) => <List.Icon {...props} icon="server" />}
          />
          <Divider />
          <List.Item
            title="Framework"
            description="React Native with Expo"
            left={(props) => <List.Icon {...props} icon="cellphone" />}
          />
        </Card.Content>
      </Card>

      {/* Features */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Features</Title>
          <List.Item
            title="Session Tracking"
            description="Log your climbing sessions with detailed information"
            left={(props) => <List.Icon {...props} icon="plus-circle" />}
          />
          <Divider />
          <List.Item
            title="Progress Analytics"
            description="View detailed statistics and progress over time"
            left={(props) => <List.Icon {...props} icon="chart-line" />}
          />
          <Divider />
          <List.Item
            title="Multiple Disciplines"
            description="Track Boulder, Lead, and Top Rope climbing"
            left={(props) => <List.Icon {...props} icon="format-list-bulleted" />}
          />
          <Divider />
          <List.Item
            title="Grade System"
            description="V-scale for bouldering, YDS for sport climbing"
            left={(props) => <List.Icon {...props} icon="numeric" />}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#e74c3c"
        buttonColor="transparent"
      >
        Logout
      </Button>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Keep climbing, keep ascending! 🧗‍♀️
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#3498db',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 14,
    color: '#95a5a6',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 24,
    borderColor: '#e74c3c',
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProfileScreen; 