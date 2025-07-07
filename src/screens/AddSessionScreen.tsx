import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import { colors } from '../theme/colors';
import { SessionDiscipline, Grade } from '../types';

const { width, height } = Dimensions.get('window');

const AddSessionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [discipline, setDiscipline] = useState<SessionDiscipline>(SessionDiscipline.BOULDER);
  const [grade, setGrade] = useState<Grade>(Grade.V3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

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

    // Form animation
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

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
  }, []);

  const handleSubmit = async () => {
    if (!date) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.createSession({
        discipline,
        grade,
        date,
        notes: notes.trim() || undefined,
        sent,
      });
      Alert.alert('Success', 'Session added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add session');
    } finally {
      setIsLoading(false);
    }
  };

  const getBoulderGrades = () => [
    Grade.V0, Grade.V1, Grade.V2, Grade.V3, Grade.V4, Grade.V5,
    Grade.V6, Grade.V7, Grade.V8, Grade.V9, Grade.V10, Grade.V11,
    Grade.V12, Grade.V13, Grade.V14, Grade.V15, Grade.V16, Grade.V17,
  ];

  const getLeadGrades = () => [
    Grade.YDS_5_6, Grade.YDS_5_7, Grade.YDS_5_8, Grade.YDS_5_9,
    Grade.YDS_5_10A, Grade.YDS_5_10B, Grade.YDS_5_10C, Grade.YDS_5_10D,
    Grade.YDS_5_11A, Grade.YDS_5_11B, Grade.YDS_5_11C, Grade.YDS_5_11D,
    Grade.YDS_5_12A, Grade.YDS_5_12B, Grade.YDS_5_12C, Grade.YDS_5_12D,
    Grade.YDS_5_13A, Grade.YDS_5_13B, Grade.YDS_5_13C, Grade.YDS_5_13D,
    Grade.YDS_5_14A, Grade.YDS_5_14B, Grade.YDS_5_14C, Grade.YDS_5_14D,
    Grade.YDS_5_15A, Grade.YDS_5_15B, Grade.YDS_5_15C, Grade.YDS_5_15D,
  ];

  const getDifficultyColor = (gradeValue: string) => {
    const gradeNum = parseInt(gradeValue.replace(/[^\d]/g, ''));
    if (discipline === SessionDiscipline.BOULDER) {
      if (gradeNum <= 3) return '#4CAF50';
      if (gradeNum <= 6) return '#FF9800';
      if (gradeNum <= 10) return '#F44336';
      return '#9C27B0';
    } else {
      if (gradeNum <= 8) return '#4CAF50';
      if (gradeNum <= 10) return '#FF9800';
      if (gradeNum <= 12) return '#F44336';
      return '#9C27B0';
    }
  };

  const currentGrades = discipline === SessionDiscipline.BOULDER ? getBoulderGrades() : getLeadGrades();

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
          <Text style={styles.headerIcon}>🧗‍♀️</Text>
          <Title style={styles.headerTitle}>Add New Session</Title>
          <Text style={styles.headerSubtitle}>
            Record your climbing achievements and track your progress
          </Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.formCardContainer,
            {
              opacity: formAnim,
              transform: [
                { translateY: formAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }) },
                { scale: formAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }) },
              ],
            },
          ]}
        >
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              {/* Discipline Selection */}
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Climbing Type</Title>
                <SegmentedButtons
                  value={discipline}
                  onValueChange={(value) => setDiscipline(value as SessionDiscipline)}
                  buttons={[
                    {
                      value: SessionDiscipline.BOULDER,
                      label: 'Bouldering',
                      style: styles.segmentedButton,
                    },
                    {
                      value: SessionDiscipline.LEAD,
                      label: 'Lead',
                      style: styles.segmentedButton,
                    },
                  ]}
                  style={styles.segmentedButtons}
                />
              </View>

              {/* Grade Selection */}
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Grade</Title>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.gradeContainer}
                >
                  {currentGrades.map((gradeOption) => (
                    <Animated.View
                      key={gradeOption}
                      style={[
                        styles.gradeChip,
                        {
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    >
                      <Chip
                        selected={grade === gradeOption}
                        onPress={() => setGrade(gradeOption)}
                        style={[
                          styles.gradeChipStyle,
                          grade === gradeOption && {
                            backgroundColor: getDifficultyColor(gradeOption),
                            borderColor: getDifficultyColor(gradeOption),
                          },
                        ]}
                        textStyle={[
                          styles.gradeChipText,
                          grade === gradeOption && styles.selectedGradeChipText,
                        ]}
                      >
                        {gradeOption}
                      </Chip>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>

              {/* Date Input */}
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Date</Title>
                <TextInput
                  label="Session Date"
                  value={date}
                  onChangeText={setDate}
                  mode="outlined"
                  style={styles.input}
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
              </View>

              {/* Notes Input */}
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Notes (Optional)</Title>
                <TextInput
                  label="Session notes..."
                  value={notes}
                  onChangeText={setNotes}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
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
              </View>

              {/* Sent Status */}
              <View style={styles.section}>
                <Title style={styles.sectionTitle}>Status</Title>
                <View style={styles.statusContainer}>
                  <Chip
                    selected={!sent}
                    onPress={() => setSent(false)}
                    style={[
                      styles.statusChip,
                      !sent && styles.selectedStatusChip,
                    ]}
                    textStyle={[
                      styles.statusChipText,
                      !sent && styles.selectedStatusChipText,
                    ]}
                  >
                    Attempted ⏳
                  </Chip>
                  <Chip
                    selected={sent}
                    onPress={() => setSent(true)}
                    style={[
                      styles.statusChip,
                      sent && styles.selectedStatusChip,
                    ]}
                    textStyle={[
                      styles.statusChipText,
                      sent && styles.selectedStatusChipText,
                    ]}
                  >
                    Sent ✅
                  </Chip>
                </View>
              </View>

              {/* Submit Button */}
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
                  Add Session
                </Button>
              </Animated.View>
            </Card.Content>
          </Card>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
    lineHeight: 24,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  segmentedButtons: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  segmentedButton: {
    borderRadius: 12,
  },
  gradeContainer: {
    paddingHorizontal: 4,
  },
  gradeChip: {
    marginRight: 12,
  },
  gradeChipStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  gradeChipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
  },
  selectedGradeChipText: {
    color: 'white',
    fontWeight: '900',
  },
  input: {
    borderRadius: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statusChip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  selectedStatusChip: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  statusChipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  selectedStatusChipText: {
    color: colors.primary,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 16,
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
});

export default AddSessionScreen; 