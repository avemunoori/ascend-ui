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
import { SessionAnalytics, ProgressAnalytics, HighestGrades, AverageGrades, SessionDiscipline } from '../types';
import { apiService } from '../services/api';

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
          <Title style={styles.cardTitle}>Overview</Title>
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
          <Title style={styles.cardTitle}>Sessions by Discipline</Title>
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
          <Title style={styles.cardTitle}>Recent Progress</Title>
          <View style={styles.progressGrid}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progressAnalytics.totalSessions}</Text>
              <Text style={styles.progressLabel}>Total Sessions</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{(progressAnalytics.sentRate * 100).toFixed(1)}%</Text>
              <Text style={styles.progressLabel}>Overall Sent Rate</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{formatGrade(progressAnalytics.avgDifficulty)}</Text>
              <Text style={styles.progressLabel}>Avg Difficulty</Text>
            </View>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderOverviewCard()}
      {renderDisciplineBreakdown()}
      {renderDifficultyBreakdown()}
      {renderSentRateBreakdown()}
      {renderHighestGrades()}
      {renderProgressData()}
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
    elevation: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
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
    color: '#34495e',
  },
  disciplinePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
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
    color: '#34495e',
  },
  difficultyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
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
    color: '#34495e',
  },
  sentRateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
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
    color: '#7f8c8d',
    marginBottom: 4,
  },
  highestGradeValue: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  progressLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default AnalyticsScreen; 