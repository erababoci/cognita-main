"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import NavBar from "../components/Navbar"
import { LinearGradient } from "expo-linear-gradient"

function SubjectScreen({ route }) {
  const navigation = useNavigation()
  const { subjects } = route.params || { subjects: [] }
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSubjects = subjects.filter((subject) => subject.title.toLowerCase().includes(searchQuery.toLowerCase()))

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
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => navigation.navigate("profile")}
            >
              <Feather name="profile" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subjectCard}
                onPress={() => navigation.navigate("Document", { subject })}
              >
                <Text style={styles.subjectTitle}>{subject.title}</Text>
              </TouchableOpacity>
            ))
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
  userButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    marginLeft: 10,
  },
  subjectCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  subjectTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
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
})

export default SubjectScreen