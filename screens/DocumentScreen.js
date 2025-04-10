"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import NavBar from "../components/Navbar"

function DocumentScreen({ route }) {
  const navigation = useNavigation()
  const { subject } = route.params || { subject: { title: "", documents: [] } }
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = subject.documents.filter((document) =>
    document.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenDocument = (document) => {
    if (document.startsWith("http") || document.startsWith("https")) {
      Linking.openURL(document).catch(() => Alert.alert("Error", "Unable to open the document link."))
    } else {
      Alert.alert("Document Info", `This is a local document: ${document}`)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{subject.title} Documents</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Documents..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
        {filteredDocuments.length > 0 ? (
          <View>
            {filteredDocuments.map((document, index) => (
              <TouchableOpacity key={index} onPress={() => handleOpenDocument(document)} style={styles.documentButton}>
                <Text style={styles.documentText}>{document}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.noDocumentsText}>No documents found.</Text>
        )}
      </ScrollView>
      <NavBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171f36",
    padding: 20,
    paddingTop:70,
    paddingBottom: 80,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272f47",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    color: "white",
    padding: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  documentButton: {
    backgroundColor: "#272f47",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  documentText: {
    color: "white",
    fontSize: 16,
  },
  noDocumentsText: {
    color: "gray",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
})

export default DocumentScreen







