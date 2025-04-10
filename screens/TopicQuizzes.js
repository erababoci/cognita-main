import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import NavBar from '../components/Navbar';

// Sample quiz data - in a real app, you'd fetch this from an API or database
const quizData = {
  "Programming": [
    {
      id: "prog1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
      questions: 15,
      timeMinutes: 20,
      difficulty: 1
    },
    {
      id: "prog2",
      title: "Python Data Structures",
      description: "Challenge yourself with questions about Python lists, dictionaries, sets, and tuples.",
      questions: 12,
      timeMinutes: 15,
      difficulty: 2
    },
    {
      id: "prog3",
      title: "Advanced Algorithms",
      description: "Test your understanding of complex algorithms and time complexity analysis.",
      questions: 10,
      timeMinutes: 25,
      difficulty: 3
    }
  ],
  "Databases": [
    {
      id: "db1",
      title: "SQL Basics",
      description: "Practice fundamental SQL queries including SELECT, INSERT, UPDATE, and DELETE.",
      questions: 12,
      timeMinutes: 15,
      difficulty: 1
    },
    {
      id: "db2",
      title: "Database Design",
      description: "Test your knowledge of normalization, relationships, and schema design.",
      questions: 10,
      timeMinutes: 20,
      difficulty: 2
    },
    {
      id: "db3",
      title: "NoSQL Concepts",
      description: "Explore document, key-value, and graph database concepts and use cases.",
      questions: 8,
      timeMinutes: 15,
      difficulty: 2
    }
  ]
};

export default function TopicQuizzes({ route, navigation }) {
  const { topic } = route.params;
  const quizzes = quizData[topic] || [];

  return (
    <LinearGradient colors={["#0b1023", "#1f2b49"]} style={styles.container} start={[0, 0]} end={[1, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{topic} Quizzes</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPress={() => navigation.navigate('QuizDetails', { quizId: quiz.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="book-open-page-variant" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>No quizzes available for this topic yet</Text>
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </LinearGradient>
  );
}

function QuizCard({ quiz, onPress }) {
  return (
    <TouchableOpacity style={styles.quizCard} onPress={onPress}>
      <View style={styles.quizCardContent}>
        <View style={styles.quizCardHeader}>
          <Text style={styles.quizCardTitle}>{quiz.title}</Text>
          <View style={[styles.difficultyBadge, 
            quiz.difficulty === 1 ? styles.easyBadge : 
            quiz.difficulty === 2 ? styles.mediumBadge : 
            styles.hardBadge
          ]}>
            <Text style={styles.difficultyText}>
              {quiz.difficulty === 1 ? 'Easy' : quiz.difficulty === 2 ? 'Medium' : 'Hard'}
            </Text>
          </View>
        </View>
        <Text style={styles.quizCardDescription}>{quiz.description}</Text>
        <View style={styles.quizCardFooter}>
          <View style={styles.quizCardStat}>
            <Feather name="help-circle" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.quizCardStatText}>{quiz.questions} questions</Text>
          </View>
          <View style={styles.quizCardStat}>
            <Feather name="clock" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={styles.quizCardStatText}>{quiz.timeMinutes} minutes</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  quizCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  quizCardContent: {
    padding: 15,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#00b894',
  },
  mediumBadge: {
    backgroundColor: '#fdcb6e',
  },
  hardBadge: {
    backgroundColor: '#ff7675',
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quizCardDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 15,
  },
  quizCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizCardStatText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingBottom: 0,
  },
});