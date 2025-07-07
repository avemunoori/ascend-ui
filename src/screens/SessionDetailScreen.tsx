import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
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
  Chip,
  IconButton,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import { Session, SessionDiscipline, Grade, RootStackParamList } from '../types';
import { apiService } from '../services/api';

const { width, height } = Dimensions.get('window');

type SessionDetailRouteProp = RouteProp<RootStackParamList, 'SessionDetail'>;
type SessionDetailNavigationProp = StackNavigationProp<RootStackParamList, 'SessionDetail'>;

const SessionDetailScreen: React.FC = () => {
  const route = useRoute<SessionDetailRouteProp>();
  const navigation = useNavigation<SessionDetailNavigationProp>();
  const { sessionId } = route.params;

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [editDiscipline, setEditDiscipline] = useState<SessionDiscipline | ''>('');
  const [editGrade, setEditGrade] = useState<string>('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSent, setEditSent] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadSession();
    
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
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setIsLoading(true);
      const sessionData = await apiService.getSession(sessionId);
      setSession(sessionData);
      
      // Initialize edit form
      setEditDiscipline(sessionData.discipline);
      setEditGrade(sessionData.grade);
      setEditDate(sessionData.date);
      setEditNotes(sessionData.notes || '');
      setEditSent(sessionData.sent);
    } catch (error) {
      Alert.alert('Error', 'Failed to load session details');
      console.error('Error loading session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editDiscipline || !editGrade || !editDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate grade format
    const isValidGrade = Object.values(Grade).includes(editGrade as Grade);
    if (!isValidGrade) {
      Alert.alert('Error', 'Please enter a valid grade (e.g., V5, 5.10a)');
      return;
    }

    try {
      setIsSaving(true);
      const updatedSession = await apiService.updateSession(sessionId, {
        discipline: editDiscipline as SessionDiscipline,
        grade: editGrade as Grade,
        date: editDate,
        notes: editNotes,
        sent: editSent,
      });
      
      setSession(updatedSession);
      setIsEditing(false);
      Alert.alert('Success', 'Session updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update session');
      console.error('Error updating session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteSession(sessionId);
              Alert.alert('Success', 'Session deleted successfully!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session');
              console.error('Error deleting session:', error);
            }
          },
        },
      ]
    );
  };

  const getDisciplineColor = (discipline: SessionDiscipline) => {
    switch (discipline) {
      case SessionDiscipline.BOULDER:
        return colors.boulder.primary;
      case SessionDiscipline.LEAD:
        return colors.lead.primary;
      case SessionDiscipline.TOPROPE:
        return colors.toprope.primary;
      default:
        return colors.primary;
    }
  };

  const getGradeColor = (grade: Grade) => {
    // Determine color based on grade difficulty
    if (grade.includes('V')) {
      const vNumber = parseInt(grade.substring(1));
      if (vNumber <= 3) return colors.success;
      if (vNumber <= 6) return colors.warning;
      return colors.error;
    } else {
      const ydsNumber = parseFloat(grade);
      if (ydsNumber <= 5.9) return colors.success;
      if (ydsNumber <= 5.11) return colors.warning;
      return colors.error;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
          style={styles.backgroundGradient}
        />
        <Animated.View style={[styles.loadingContent, { opacity: fadeAnim }]}>
          <Text style={styles.loadingText}>Loading session details...</Text>
        </Animated.View>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
          style={styles.backgroundGradient}
        />
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
          
          {!isEditing && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
          {/* Session Card */}
          <View style={styles.sessionCard}>
            <View style={styles.cardHeader}>
              <Title style={styles.sessionTitle}>
                {isEditing ? 'Edit Session' : 'Session Details'}
              </Title>
              <Chip
                mode="outlined"
                textStyle={{ color: getDisciplineColor(session.discipline) }}
                style={[
                  styles.disciplineChip,
                  { borderColor: getDisciplineColor(session.discipline) },
                ]}
              >
                {session.discipline}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            {isEditing ? (
              /* Edit Form */
              <View style={styles.editForm}>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Discipline</Text>
                  <View style={styles.chipContainer}>
                    {Object.values(SessionDiscipline).map((discipline) => (
                      <TouchableOpacity
                        key={discipline}
                        onPress={() => setEditDiscipline(discipline)}
                        style={[
                          styles.chip,
                          editDiscipline === discipline && {
                            backgroundColor: getDisciplineColor(discipline),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            editDiscipline === discipline && { color: 'white' },
                          ]}
                        >
                          {discipline}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.label}>Grade</Text>
                  <TextInput
                    value={editGrade}
                    onChangeText={setEditGrade}
                    mode="outlined"
                    style={styles.input}
                    placeholder="e.g., V5, 5.10a"
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput
                    value={editDate}
                    onChangeText={setEditDate}
                    mode="outlined"
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.label}>Notes</Text>
                  <TextInput
                    value={editNotes}
                    onChangeText={setEditNotes}
                    mode="outlined"
                    style={styles.input}
                    multiline
                    numberOfLines={3}
                    placeholder="Add notes about your session..."
                  />
                </View>

                <View style={styles.formRow}>
                  <Text style={styles.label}>Sent</Text>
                  <TouchableOpacity
                    onPress={() => setEditSent(!editSent)}
                    style={[
                      styles.sentToggle,
                      editSent && { backgroundColor: colors.success },
                    ]}
                  >
                    <Text style={[styles.sentText, editSent && { color: 'white' }]}>
                      {editSent ? 'Yes' : 'No'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.saveButton}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={[colors.success, colors.success]}
                    style={styles.saveGradient}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              /* View Mode */
              <View style={styles.viewContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Grade</Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getGradeColor(session.grade) }}
                    style={[
                      styles.gradeChip,
                      { borderColor: getGradeColor(session.grade) },
                    ]}
                  >
                    {session.grade}
                  </Chip>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(session.date)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sent</Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: session.sent ? colors.success : colors.error }}
                    style={[
                      styles.sentChip,
                      { borderColor: session.sent ? colors.success : colors.error },
                    ]}
                  >
                    {session.sent ? 'Yes' : 'No'}
                  </Chip>
                </View>

                {session.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes</Text>
                    <Text style={styles.notesText}>{session.notes}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Stats Card */}
          <Animated.View
            style={[
              styles.statsCard,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Title style={styles.statsTitle}>Session Stats</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{session.discipline}</Text>
                <Text style={styles.statLabel}>Discipline</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{session.grade}</Text>
                <Text style={styles.statLabel}>Grade</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {session.sent ? '✅' : '❌'}
                </Text>
                <Text style={styles.statLabel}>Sent</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sessionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  disciplineChip: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 16,
  },
  editForm: {
    gap: 20,
  },
  formRow: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: 'transparent',
  },
  sentToggle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  sentText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  viewContent: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  gradeChip: {
    backgroundColor: 'transparent',
  },
  sentChip: {
    backgroundColor: 'transparent',
  },
  notesContainer: {
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    backgroundColor: colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default SessionDetailScreen; 