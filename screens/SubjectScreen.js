"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import NavBar from "../components/Navbar"
import { LinearGradient } from "expo-linear-gradient"

function SubjectScreen({ route }) {
  const navigation = useNavigation()
  const { subjects } = route.params || { subjects: [] }
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSubjects = subjects.filter((subject) => subject.title.toLowerCase().includes(searchQuery.toLowerCase()))

  // Group subjects by category for multiple carousels
  const groupedSubjects = filteredSubjects.reduce((acc, subject) => {
    const category = subject.category || "General"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(subject)
    return acc
  }, {})

  // Render a single subject card
  const renderSubjectCard = (subject) => (
    <TouchableOpacity style={styles.subjectCard} onPress={() => navigation.navigate("Document", { subject })}>
      {subject.icon && (
        <View style={styles.iconContainer}>
          <Feather name={subject.icon} size={24} color="white" />
        </View>
      )}
      <Text style={styles.subjectTitle}>{subject.title}</Text>
      {subject.quizCount && <Text style={styles.quizCount}>{subject.quizCount} quizzes</Text>}
    </TouchableOpacity>
  )

  // Render a horizontal carousel for a category
  const renderCarousel = (title, data) => (
    <View style={styles.carouselContainer}>
      <View style={styles.carouselHeader}>
        <Text style={styles.carouselTitle}>{title}</Text>
        {data.length > 3 && (
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        data={data}
        renderItem={({ item }) => renderSubjectCard(item)}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      />
    </View>
  )

  // Featured subjects (first 3 items)
  const featuredSubjects = filteredSubjects.slice(0, 3)

  return (
    <LinearGradient colors={["#0b1023", "#1f2b49"]} style={styles.container} start={[0, 0]} end={[1, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Subjects</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Subjects..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Feather name="search" size={16} color="white" />
            </TouchableOpacity>
           
          </View>

          {filteredSubjects.length > 0 ? (
            <>
              {/* Featured Subjects */}
              {featuredSubjects.length > 0 && (
                <View style={styles.featuredContainer}>
                  <View style={styles.carouselHeader}>
                    <Text style={styles.carouselTitle}>Featured</Text>
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>Top Picks</Text>
                    </View>
                  </View>
                  <FlatList
                    horizontal
                    data={featuredSubjects}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.featuredCard}
                        onPress={() => navigation.navigate("Document", { subject: item })}
                      >
                        <View style={styles.featuredIconContainer}>
                          <Feather name={item.icon || "code"} size={28} color="white" />
                        </View>
                        <Text style={styles.featuredTitle}>{item.title}</Text>
                        <Text style={styles.featuredDescription}>
                          {item.description || "Test your coding skills across multiple languages and frameworks."}
                        </Text>
                        <Text style={styles.quizCount}>{item.quizCount || "156"} quizzes</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => `featured-${item.title}-${index}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.featuredContent}
                  />
                </View>
              )}

              {/* Category Carousels */}
              {Object.keys(groupedSubjects).map((category) => renderCarousel(category, groupedSubjects[category]))}
            </>
          ) : (
            <Text style={styles.noSubjectsText}>No subjects found.</Text>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  scrollView: {
    flex: 1,
    padding: 15,
    marginTop: -10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  searchContainer: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: "white",
    marginRight: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
  },
 
  // Featured section styles
  featuredContainer: {
    marginBottom: 25,
  },
  featuredContent: {
    paddingRight: 15,
  },
  featuredCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 280,
    height: 200,
  },
  featuredIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(108, 92, 231, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  featuredTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  featuredDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  // Carousel section styles
  carouselContainer: {
    marginBottom: 25,
  },
  carouselHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  carouselTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllText: {
    color: "#6c5ce7",
    fontSize: 14,
  },
  carouselContent: {
    paddingRight: 15,
  },
  subjectCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 15,
    padding: 20,
    marginRight: 15,
    width: 200,
    height: 150,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(108, 92, 231, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  subjectTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quizCount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
  noSubjectsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingBottom: 0,
  },
  badgeContainer: {
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
})

export default SubjectScreen
