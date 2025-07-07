import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  ActivityIndicator,
  Chip,
  Button,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SessionAnalytics, ProgressAnalytics, HighestGrades, AverageGrades, SessionDiscipline } from '../types';
import { apiService } from '../services/api';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const AnalyticsScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<SessionAnalytics | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<ProgressAnalytics | null>(null);
  const [highestGrades, setHighestGrades] = useState<HighestGrades | null>(null);
  const [averageGrades, setAverageGrades] = useState<AverageGrades | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsData, progressData, highestData, averageData] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getProgressAnalytics(),
        apiService.getHighestGrades(),
        apiService.getAverageGrades(),
      ]);
      
      setAnalytics(analyticsData);
      setProgressAnalytics(progressData);
      setHighestGrades(highestData);
      setAverageGrades(averageData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const getDisciplineColor = (discipline: SessionDiscipline) => {
    switch (discipline) {
      case SessionDiscipline.BOULDER:
        return '#e74c3c';
      case SessionDiscipline.LEAD:
        return '#3498db';
      case SessionDiscipline.TOPROPE:
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  const getDisciplineLabel = (discipline: SessionDiscipline) => {
    switch (discipline) {
      case SessionDiscipline.BOULDER:
        return 'Boulder';
      case SessionDiscipline.LEAD:
        return 'Lead';
      case SessionDiscipline.TOPROPE:
        return 'Top Rope';
      default:
        return discipline;
    }
  };

  const formatGrade = (grade: string | number) => {
    if (typeof grade === 'number') {
      return grade.toFixed(1);
    }
    return grade;
  };

  const renderOverviewCard = () => {
    if (!analytics) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Overview</Title>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{analytics.totalSessions}</Text>
              <Text style={styles.overviewLabel}>Total Sessions</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{formatGrade(analytics.averageDifficulty)}</Text>
              <Text style={styles.overviewLabel}>Avg Difficulty</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>{(analytics.sentPercentage * 100).toFixed(1)}%</Text>
              <Text style={styles.overviewLabel}>Sent Rate</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderDisciplineBreakdown = () => {
    if (!analytics) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>🧗‍♀️ Sessions by Discipline</Title>
          {Object.entries(analytics.sessionsByDiscipline).map(([discipline, count]) => (
            <View key={discipline} style={styles.disciplineRow}>
              <View style={styles.disciplineInfo}>
                <Chip
                  mode="outlined"
                  style={[styles.disciplineChip, { borderColor: getDisciplineColor(discipline as SessionDiscipline) }]}
                  textStyle={{ color: getDisciplineColor(discipline as SessionDiscipline) }}
                >
                  {getDisciplineLabel(discipline as SessionDiscipline)}
                </Chip>
                <Text style={styles.disciplineCount}>{count} sessions</Text>
              </View>
              <Text style={styles.disciplinePercentage}>
                {((count / analytics.totalSessions) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderDifficultyBreakdown = () => {
    if (!analytics) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Average Difficulty by Discipline</Title>
          {Object.entries(analytics.averageDifficultyByDiscipline).map(([discipline, difficulty]) => (
            <View key={discipline} style={styles.difficultyRow}>
              <View style={styles.difficultyInfo}>
                <Text style={styles.difficultyLabel}>
                  {getDisciplineLabel(discipline as SessionDiscipline)}
                </Text>
                <Text style={styles.difficultyValue}>{formatGrade(difficulty)}</Text>
              </View>
              <ProgressBar
                progress={difficulty / 17} // Assuming max grade is V17/5.15d
                color={getDisciplineColor(discipline as SessionDiscipline)}
                style={styles.progressBar}
              />
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderSentRateBreakdown = () => {
    if (!analytics) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sent Rate by Discipline</Title>
          {Object.entries(analytics.sentPercentageByDiscipline).map(([discipline, rate]) => (
            <View key={discipline} style={styles.sentRateRow}>
              <View style={styles.sentRateInfo}>
                <Text style={styles.sentRateLabel}>
                  {getDisciplineLabel(discipline as SessionDiscipline)}
                </Text>
                <Text style={styles.sentRateValue}>{(rate * 100).toFixed(1)}%</Text>
              </View>
              <ProgressBar
                progress={rate}
                color={getDisciplineColor(discipline as SessionDiscipline)}
                style={styles.progressBar}
              />
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderHighestGrades = () => {
    if (!highestGrades) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Highest Grades</Title>
          <View style={styles.highestGradesGrid}>
            {Object.entries(highestGrades).map(([discipline, grade]) => (
              <View key={discipline} style={styles.highestGradeItem}>
                <Text style={styles.highestGradeLabel}>
                  {getDisciplineLabel(discipline as SessionDiscipline)}
                </Text>
                <Text style={[styles.highestGradeValue, { color: getDisciplineColor(discipline as SessionDiscipline) }]}>
                  {grade}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderProgressData = () => {
    if (!progressAnalytics) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>📈 Progress Insights</Title>
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progressAnalytics.totalSessions}</Text>
              <Text style={styles.progressLabel}>Total Sessions</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{(progressAnalytics.sentRate * 100).toFixed(1)}%</Text>
              <Text style={styles.progressLabel}>Success Rate</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{formatGrade(progressAnalytics.avgDifficulty)}</Text>
              <Text style={styles.progressLabel}>Avg Difficulty</Text>
            </View>
          </View>
          
          {/* Progress Motivation */}
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>
              {progressAnalytics.sentRate > 0.7 
                ? "🔥 You're crushing it! Keep pushing your limits!"
                : progressAnalytics.sentRate > 0.5
                ? "💪 Great progress! Focus on technique and consistency."
                : "🎯 Every session counts! Focus on fundamentals and build confidence."
              }
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="white"
            colors={['white']}
          />
        }
      >
        <Title style={styles.pageTitle}>Analytics Dashboard</Title>
        {renderOverviewCard()}
        {renderDisciplineBreakdown()}
        {renderDifficultyBreakdown()}
        {renderSentRateBreakdown()}
        {renderHighestGrades()}
        {renderProgressData()}
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
  scrollContainer: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    overflow: 'hidden',
  },
  cardGradient: {
    display: 'none',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontWeight: '600',
  },
  disciplineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  disciplineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  disciplineChip: {
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  disciplineCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  disciplinePercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  difficultyRow: {
    marginBottom: 16,
  },
  difficultyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  difficultyLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  difficultyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  sentRateRow: {
    marginBottom: 16,
  },
  sentRateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sentRateLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  sentRateValue: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  highestGradesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highestGradeItem: {
    alignItems: 'center',
    flex: 1,
  },
  highestGradeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '600',
  },
  highestGradeValue: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  motivationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  motivationText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default AnalyticsScreen; 