import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from "react-native"
import { FontAwesome5, Feather } from "@expo/vector-icons"
import { BlurView } from "expo-blur"

const Explore = ({ 
  isVisible, 
  overlayType, 
  onClose, 
  searchQuery = "", 
  onSearchChange, 
  filteredCategories = [], 
  filteredSubjects = [], 
  categories = [], 
  subjects = [], 
  onCategoryPress, 
  onSubjectPress, 
  onDocumentPress,
  onSearchSubmit
}) => {
  if (!isVisible) return null

  const normalizedType = overlayType?.toLowerCase()

  return (
    <BlurView intensity={40} style={styles.overlay}>
      {/* Search Overlay Content */}
      {normalizedType === 'search' && (
        <>
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={onClose}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#555" style={styles.searchInputIcon} />
              <TextInput
                style={styles.searchInputField}
                placeholder="Search categories and content..."
                placeholderTextColor="#555"
                value={searchQuery}
                onChangeText={onSearchChange}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={onSearchSubmit}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => onSearchChange("")}>
                  <Feather name="x" size={20} color="#555" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {searchQuery.length > 0 && (
            <ScrollView style={styles.searchResults}>
              {filteredCategories.length > 0 && (
                <View style={styles.searchResultSection}>
                  <Text style={styles.searchResultTitle}>Categories</Text>
                  {filteredCategories.map((category, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.searchResultItem}
                      onPress={() => onCategoryPress(category)}
                    >
                      <FontAwesome5 name={category.icon} size={16} color="white" style={styles.searchResultIcon} />
                      <Text style={styles.searchResultText}>{category.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {filteredSubjects.length > 0 && (
                <View style={styles.searchResultSection}>
                  <Text style={styles.searchResultTitle}>Subjects</Text>
                  {filteredSubjects.map((subject, subjectIndex) => (
                    <View key={subjectIndex}>
                      <TouchableOpacity 
                        style={styles.searchResultItem}
                        onPress={() => onSubjectPress(subject)}
                      >
                        <FontAwesome5 name="book" size={16} color="white" style={styles.searchResultIcon} />
                        <Text style={styles.searchResultText}>{subject.title}</Text>
                      </TouchableOpacity>
                      
                      {subject.documents.map((doc, docIndex) => (
                        <TouchableOpacity 
                          key={docIndex}
                          style={[styles.searchResultItem, styles.searchResultSubItem]}
                          onPress={() => onDocumentPress(doc, subject.title)}
                        >
                          <FontAwesome5 
                            name={doc.endsWith('.pdf') ? 'file-pdf' : 'file-powerpoint'} 
                            size={14} 
                            color="#6C63FF" 
                            style={styles.searchResultIcon} 
                          />
                          <Text style={styles.searchResultText}>{doc}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>
              )}

              {filteredCategories.length === 0 && filteredSubjects.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
                </View>
              )}
            </ScrollView>
          )}
        </>
      )}

      {/* Explore Overlay Content */}
      {(normalizedType === 'explore') && (
        <>
          <View style={styles.overlayHeader}>
            <TouchableOpacity onPress={onClose}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.overlayTitle}>Explore</Text>
            <TouchableOpacity 
              style={styles.exploreSearchButton}
              onPress={() => {
                onClose();
                setTimeout(() => {
                  onSearchChange("");
                  const event = new CustomEvent('showSearchOverlay');
                  document.dispatchEvent(event);
                }, 100);
              }}
            >
              <Feather name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.exploreContent}>
            <Text style={styles.exploreHeading}>Quick Access</Text>
            <View style={styles.exploreGrid}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.exploreCard}
                  onPress={() => onCategoryPress(category)}
                >
                  <FontAwesome5 name={category.icon} size={24} color="#6C63FF" />
                  <Text style={styles.exploreCardTitle}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.exploreHeading}>Recent Subjects</Text>
            <View style={styles.recentList}>
              {subjects.slice(0, 3).map((subject, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => onSubjectPress(subject)}
                >
                  <FontAwesome5 name="book" size={18} color="white" style={styles.recentItemIcon} />
                  <View style={styles.recentItemContent}>
                    <Text style={styles.recentItemTitle}>{subject.title}</Text>
                    <Text style={styles.recentItemSubtitle}>{subject.documents.length} documents</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#6C63FF" />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </BlurView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171f36",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: "rgba(23, 31, 54, 0.9)",
  },
  overlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#171f36",
  },
  overlayTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
    flex: 1,
  },
  exploreSearchButton: {
    padding: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginLeft: 15,
    paddingHorizontal: 10,
  },
  searchInputIcon: {
    marginRight: 10,
  },
  searchInputField: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  searchResults: {
    flex: 1,
    padding: 20,
  },
  searchResultSection: {
    marginBottom: 20,
  },
  searchResultTitle: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#272f47",
  },
  searchResultSubItem: {
    paddingLeft: 30,
    backgroundColor: "#1d2540",
  },
  searchResultIcon: {
    marginRight: 15,
  },
  searchResultText: {
    color: "white",
    fontSize: 14,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  noResultsText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  exploreContent: {
    flex: 1,
    padding: 20,
  },
  exploreHeading: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },
  exploreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  exploreCard: {
    backgroundColor: "#272f47",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  exploreCardTitle: {
    color: "white",
    fontWeight: "bold",
    marginTop: 10,
  },
  recentList: {
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272f47",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  recentItemIcon: {
    marginRight: 15,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  recentItemSubtitle: {
    color: "gray",
    fontSize: 12,
    marginTop: 3,
  },
})

export default Explore
