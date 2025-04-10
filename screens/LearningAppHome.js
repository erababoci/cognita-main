import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { FontAwesome5, Feather } from "@expo/vector-icons"
import ProgressBar from "react-native-progress/Bar"
import NavBar from "../components/Navbar"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import QuizzComponent from "../components/QuizzComponent"
import Explore from "../components/Explore"

function LearningAppHome({ navigation, route }) {
  const { firstName = "User", lastName = "", userClass = "", selectedSchool = "" } = route.params || {}
  const [isOverlayVisible, setIsOverlayVisible] = useState(false)
  const [activeOverlayType, setActiveOverlayType] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState([])
  const [filteredSubjects, setFilteredSubjects] = useState([])

  const getSubjects = (school) => {
    switch (school) {
      case "school_a":
        return [
          { title: "Programming", documents: ["Object Oriented.pdf", "Algorithms.pptx"] },
          { title: "Databases", documents: ["SQL Basics.pdf", "ER Diagrams.pptx"] },
          { title: "Networking", documents: ["Network Layers.pdf", "TCP/IP.pptx"] },
          { title: "Technical Info", documents: ["Hardware Basics.pdf", "Software Systems.pptx"] },
        ]
      case "school_b":
        return [
          { title: "History", documents: ["World History.pdf", "Ancient Civilizations.pptx"] },
          { title: "Geography", documents: ["Continents.pdf", "Maps.pptx"] },
        ]
      case "school_c":
        return [
          { title: "Physics", documents: ["Quantum Mechanics.pdf", "Classical Physics.pptx"] },
          { title: "Chemistry", documents: ["Organic Chemistry.pdf", "Periodic Table.pptx"] },
        ]
      default:
        return []
    }
  }

  const subjects = getSubjects(selectedSchool)

  const categories = [
    { title: "Subjects", icon: "book", progress: 9 / 24 },
    { title: "Events", icon: "calendar", progress: 4 / 18 },
    { title: "Quizzes", icon: "clipboard-check", progress: 3 / 15 },
    { title: "Learning path", icon: "route", progress: 3 / 15 },
  ]

  const overallProgress = 0.76 // 76% progress

  // Function to show overlay - MODIFIED to handle explore similar to other overlays
  const showOverlay = (overlayType) => {
    setActiveOverlayType(overlayType)
    setIsOverlayVisible(true)
    
    if (overlayType === 'search') {
      setSearchQuery("")
      setFilteredCategories([])
      setFilteredSubjects([])
    }
  }

  // Function to close overlay
  const closeOverlay = () => {
    setIsOverlayVisible(false)
    setActiveOverlayType(null)
    setSearchQuery("")
    setFilteredCategories([])
    setFilteredSubjects([])
  }

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchQuery(text)
    
    if (text.trim() === "") {
      setFilteredCategories([])
      setFilteredSubjects([])
      return
    }
    
    const query = text.toLowerCase()
    
    // Filter categories
    const matchedCategories = categories.filter(category => 
      category.title.toLowerCase().includes(query)
    )
    setFilteredCategories(matchedCategories)
    
    // Filter subjects and their documents
    const matchedSubjects = subjects.map(subject => {
      const subjectMatches = subject.title.toLowerCase().includes(query)
      
      const matchedDocuments = subject.documents.filter(doc => 
        doc.toLowerCase().includes(query)
      )
      
      if (subjectMatches || matchedDocuments.length > 0) {
        return {
          ...subject,
          documents: subjectMatches ? subject.documents : matchedDocuments
        }
      }
      return null
    }).filter(Boolean)
    
    setFilteredSubjects(matchedSubjects)
  }

  // Navigate to search results
  const navigateToSearchResults = () => {
    if (searchQuery.trim() !== "") {
      navigation.navigate("SearchResults", {
        query: searchQuery,
        categories: filteredCategories,
        subjects: filteredSubjects
      })
      closeOverlay()
    }
  }

  // Function to navigate to category
  const handleCategoryPress = (category) => {
    closeOverlay()
    if (category.title === "Subjects") {
      navigation.navigate("Subjects", { subjects })
    } else if (category.title === "Learning path") {
      navigation.navigate("learningpath")
    } else if (category.title === "Quizzes") {
      navigation.navigate("Quizz")
    } else if (category.title === "Events") {
      navigation.navigate("events")
    
  } else if (category.title === " Progress") {
    navigation.navigate("Progress")
  }
  }

  // Function to navigate to subject detail
  const handleSubjectPress = (subject) => {
    closeOverlay()
    navigation.navigate("SubjectDetail", { subject })
  }

  // Function to navigate to document viewer
  const handleDocumentPress = (document, subjectTitle) => {
    closeOverlay()
    navigation.navigate("DocumentViewer", { document, subject: subjectTitle })
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "right", "left"]}>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>
                  Hello {firstName} {lastName}
                </Text>
                <Text style={styles.classText}>{userClass}</Text>
                <TouchableOpacity 
                  style={styles.overviewButton}
              
                >
                  <Text style={styles.overviewButtonText}>Overview</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => showOverlay('search')}
                >
                  <Feather name="search" size={24} color="white" />
                </TouchableOpacity>
                
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Your progress</Text>
              <Text style={styles.progressDescription}>Here you can see your progress on the lessons</Text>
              <ProgressBar
                progress={overallProgress}
                width={null}
                height={8}
                color="#6C63FF"
                unfilledColor="#3D4766"
                borderWidth={0}
                style={styles.progressBar}
              />
              <Text style={styles.progressPercentage}>{Math.round(overallProgress * 100)}%</Text>
            </View>

            <Text style={styles.categoriesTitle}>Categories</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCategoryPress(category)}
                  style={styles.categoryCard}
                >
                  <FontAwesome5 name={category.icon} size={24} color="white" />
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <ProgressBar
                    progress={category.progress}
                    width={null}
                    height={4}
                    color="#6C63FF"
                    unfilledColor="#3D4766"
                    borderWidth={0}
                    style={styles.categoryProgressBar}
                  />
                  <Text style={styles.categoryProgress}>{Math.round(category.progress * 100)}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <NavBar 
  navigation={navigation} 
  showOverlay={showOverlay}
/>
        </View>

        {/* Overlay Component */}
        <Explore
          isVisible={isOverlayVisible}
          overlayType={activeOverlayType}
          onClose={closeOverlay}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          filteredCategories={filteredCategories}
          filteredSubjects={filteredSubjects}
          categories={categories}
          subjects={subjects}
          onCategoryPress={handleCategoryPress}
          onSubjectPress={handleSubjectPress}
          onDocumentPress={handleDocumentPress}
          onSearchSubmit={navigateToSearchResults}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#171f36",
  },
  mainContainer: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 100, // Increased to make room for the NavBar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    padding: 10,
    marginRight: 10,
  },

  greeting: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  classText: {
    color: "gray",
    fontSize: 16,
  },
  overviewButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  overviewButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  progressSection: {
    backgroundColor: "#272f47",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
  progressTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  progressDescription: {
    color: "gray",
    marginBottom: 10,
  },
  progressBar: {
    width: "100%",
    marginBottom: 5,
  },
  progressPercentage: {
    color: "white",
    fontSize: 16,
    alignSelf: "flex-end",
  },
  categoriesTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  categoryCard: {
    backgroundColor: "#272f47",
    borderRadius: 15,
    padding: 20,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "space-between",
    height: 140,
  },
  categoryTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryProgress: {
    color: "gray",
    marginTop: 5,
  },
  categoryProgressBar: {
    width: "100%",
    marginTop: 10,
  },
})

export default LearningAppHome