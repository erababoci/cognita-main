"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import NavBar from "../components/Navbar"
import { LinearGradient } from "expo-linear-gradient"

function DocumentScreen({ route }) {
  const navigation = useNavigation()
  const { subject } = route.params || { subject: { title: "", documents: [] } }
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = subject.documents
    ? subject.documents.filter((document) => document.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const handleOpenDocument = (document) => {
    if (document.startsWith("http") || document.startsWith("https")) {
      Linking.openURL(document).catch(() => Alert.alert("Error", "Unable to open the document link."))
    } else {
      Alert.alert("Document Info", `This is a local document: ${document}`)
    }
  }

  return (
    <LinearGradient colors={["#0b1023", "#1f2b49"]} style={styles.container} start={[0, 0]} end={[1, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>{subject.title || "Documents"}</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Documents..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Feather name="search" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {filteredDocuments.length > 0 ? (
            <View style={styles.documentsContainer}>
              {filteredDocuments.map((document, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOpenDocument(document)}
                  style={styles.documentButton}
                >
                  <View style={styles.documentIconContainer}>
                    <Feather name="file-text" size={20} color="white" />
                  </View>
                  <Text style={styles.documentText}>{document}</Text>
                  <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather name="file" size={50} color="rgba(255,255,255,0.2)" />
              <Text style={styles.noDocumentsText}>No documents found.</Text>
              <Text style={styles.noDocumentsSubtext}>
                Try searching with different keywords or check back later for new content.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Fixed bottom navigation bar */}
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
    paddingTop: 50,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add padding to ensure content isn't hidden behind navbar
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: "white",
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  documentsContainer: {
    marginTop: 10,
  },
  documentButton: {
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(108, 92, 231, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  documentText: {
    color: "white",
    fontSize: 16,
    flex: 1,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 20,
  },
  noDocumentsText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  noDocumentsSubtext: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(11, 16, 35, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
})

export default DocumentScreen
