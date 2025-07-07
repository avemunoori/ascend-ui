import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  Searchbar,
  Button,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSessions } from '../contexts/SessionsContext';
import { colors } from '../theme/colors';
import { Session, SessionDiscipline } from '../types';

const { width, height } = Dimensions.get('window');

const SessionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { sessions, loading, refreshSessions } = useSessions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'bouldering' | 'lead'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    // FAB animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fabAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fabAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshSessions();
    setRefreshing(false);
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'bouldering' && session.discipline === SessionDiscipline.BOULDER) ||
                         (selectedFilter === 'lead' && session.discipline === SessionDiscipline.LEAD);
    return matchesSearch && matchesFilter;
  });

  const getGradeDisplay = (grade: string) => {
    return grade;
  };

  const getDifficultyColor = (grade: string, discipline: SessionDiscipline) => {
    const gradeNum = parseInt(grade.replace(/[^\d]/g, ''));
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  const fabScale = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <LinearGradient
        colors={[colors.gradients.primary[0], colors.gradients.primary[1]]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight, opacity: headerOpacity }]}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
          style={styles.headerGradient}
        >
          <Animated.View style={[styles.headerContent, { transform: [{ translateY: slideAnim }] }]}>
            <Title style={styles.headerTitle}>My Sessions</Title>
            <Paragraph style={styles.headerSubtitle}>
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} • Keep climbing! 🧗‍♀️
            </Paragraph>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            colors={['white']}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Search and Filter Section */}
        <Animated.View style={[styles.searchSection, { opacity: fadeAnim }]}>
          <Searchbar
            placeholder="Search sessions..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="rgba(255, 255, 255, 0.7)"
            inputStyle={{ color: 'white' }}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            theme={{
              colors: {
                surface: 'rgba(255, 255, 255, 0.15)',
                placeholder: 'rgba(255, 255, 255, 0.5)',
                text: 'white',
              },
            }}
          />

          <View style={styles.filterContainer}>
            <Chip
              selected={selectedFilter === 'all'}
              onPress={() => setSelectedFilter('all')}
              style={[styles.filterChip, selectedFilter === 'all' && styles.selectedChip]}
              textStyle={[styles.filterText, selectedFilter === 'all' && styles.selectedFilterText]}
            >
              All
            </Chip>
            <Chip
              selected={selectedFilter === 'bouldering'}
              onPress={() => setSelectedFilter('bouldering')}
              style={[styles.filterChip, selectedFilter === 'bouldering' && styles.selectedChip]}
              textStyle={[styles.filterText, selectedFilter === 'bouldering' && styles.selectedFilterText]}
            >
              Bouldering
            </Chip>
            <Chip
              selected={selectedFilter === 'lead'}
              onPress={() => setSelectedFilter('lead')}
              style={[styles.filterChip, selectedFilter === 'lead' && styles.selectedChip]}
              textStyle={[styles.filterText, selectedFilter === 'lead' && styles.selectedFilterText]}
            >
              Lead
            </Chip>
          </View>
        </Animated.View>

        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          {filteredSessions.length === 0 ? (
            <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
              <Text style={styles.emptyIcon}>🧗‍♀️</Text>
              <Title style={styles.emptyTitle}>
                {searchQuery || selectedFilter !== 'all' ? 'No sessions found' : 'No sessions yet'}
              </Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start your climbing journey by adding your first session!'
                }
              </Paragraph>
              {!searchQuery && selectedFilter === 'all' && (
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddSession' as never)}
                  style={styles.emptyButton}
                  buttonColor="white"
                  textColor={colors.primary}
                >
                  Add First Session
                </Button>
              )}
            </Animated.View>
          ) : (
            filteredSessions.map((session, index) => (
              <Animated.View
                key={session.id}
                style={[
                  styles.sessionCardContainer,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim },
                    ],
                  },
                ]}
              >
                                 <TouchableOpacity
                   onPress={() => {
                     // @ts-ignore
                     navigation.navigate('SessionDetail', { sessionId: session.id });
                   }}
                   activeOpacity={0.8}
                 >
                   <Card style={styles.sessionCard}>
                     <LinearGradient
                       colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                       style={styles.cardGradient}
                     >
                       <Card.Content style={styles.cardContent}>
                         <View style={styles.cardHeader}>
                           <View style={styles.cardTitleContainer}>
                             <Title style={styles.cardTitle}>{session.grade}</Title>
                             <Chip
                               mode="outlined"
                               style={[
                                 styles.typeChip,
                                 { borderColor: getDifficultyColor(session.grade, session.discipline) }
                               ]}
                               textStyle={[
                                 styles.typeChipText,
                                 { color: getDifficultyColor(session.grade, session.discipline) }
                               ]}
                             >
                               {session.discipline}
                             </Chip>
                           </View>
                           <IconButton
                             icon="chevron-right"
                             iconColor="rgba(255, 255, 255, 0.7)"
                             size={24}
                           />
                         </View>

                         <View style={styles.cardStats}>
                           <View style={styles.statItem}>
                             <Text style={styles.statLabel}>Date</Text>
                             <Text style={styles.statValue}>
                               {new Date(session.date).toLocaleDateString()}
                             </Text>
                           </View>
                           <View style={styles.statItem}>
                             <Text style={styles.statLabel}>Status</Text>
                             <Text style={styles.statValue}>
                               {session.sent ? 'Sent ✅' : 'Attempted ⏳'}
                             </Text>
                           </View>
                           <View style={styles.statItem}>
                             <Text style={styles.statLabel}>Grade</Text>
                             <Text style={[
                               styles.statValue,
                               { color: getDifficultyColor(session.grade, session.discipline) }
                             ]}>
                               {getGradeDisplay(session.grade)}
                             </Text>
                           </View>
                         </View>

                         {session.notes && (
                           <Paragraph style={styles.cardNotes} numberOfLines={2}>
                             {session.notes}
                           </Paragraph>
                         )}
                       </Card.Content>
                     </LinearGradient>
                   </Card>
                 </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('AddSession' as never)}
          color={colors.primary}
        />
      </Animated.View>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 220,
    paddingBottom: 100,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
  selectedChip: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  selectedFilterText: {
    color: colors.primary,
    fontWeight: '700',
  },
  sessionsContainer: {
    paddingHorizontal: 24,
  },
  sessionCardContainer: {
    marginBottom: 16,
  },
  sessionCard: {
    borderRadius: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardGradient: {
    borderRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeChipText: {
    fontWeight: '700',
    fontSize: 12,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  cardNotes: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    borderRadius: 16,
    paddingHorizontal: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    backgroundColor: 'white',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});

export default SessionsScreen; 