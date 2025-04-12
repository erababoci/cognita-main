"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native"
import * as ImagePicker from "expo-image-picker"

// Mock user data for preview
const mockUserData = {
  id: "123456",
  username: "era_b2026",
  email: "era_test_email@gmail.com",
  avatar_url: "https://www.flaticon.com/free-icon/profile-user_64572?term=profile&page=1&position=1&origin=tag&related_id=64572",
  created_at: "2023-05-15T10:30:00Z",
  last_login: "2024-04-12T08:45:00Z",
  learning_streak: 15,
  completed_courses: 7,
  coding_points: 2350,
  level: 8,
  xp_current: 3240,
  xp_next_level: 5000,
  badges: [
    { id: 1, name: "Fast Learner", icon: "🚀", description: "Completed 5 courses in a week" },
    { id: 2, name: "Quiz Master", icon: "🧠", description: "Scored 100% in 10 quizzes" },
    { id: 3, name: "Consistent", icon: "📆", description: "30 day learning streak" },
    { id: 4, name: "Code Ninja", icon: "⚡", description: "Completed advanced challenges" },
  ],
}

export default function StudentProfile() {
  // State for user data
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(mockUserData.username)
  const [isLoading, setIsLoading] = useState(false)

  // Function to pick an image from gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photo library")
        return
      }

      setIsLoading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      setIsLoading(false)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // In a real app, you would upload this to your server/storage
        setUserData({
          ...userData,
          avatar_url: result.assets[0].uri,
        })
        Alert.alert("Success", "Profile picture updated successfully!")
      }
    } catch (error) {
      setIsLoading(false)
      Alert.alert("Error", "Failed to update profile picture")
      console.log(error)
    }
  }

  // Function to save username changes
  const saveChanges = () => {
    if (newUsername.trim() === "") {
      Alert.alert("Error", "Username cannot be empty")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        username: newUsername,
      })
      setIsEditing(false)
      setIsLoading(false)
      Alert.alert("Success", "Username updated successfully!")
    }, 1000)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate XP progress percentage
  const xpProgress = (userData.xp_current / userData.xp_next_level) * 100

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121628" />


      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {isLoading ? (
              <View style={styles.profileImage}>
                <ActivityIndicator size="large" color="#6c5ce7" />
              </View>
            ) : (
              <Image source={{ uri: userData.avatar_url }} style={styles.profileImage} />
            )}
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage} disabled={isLoading}>
              <Text style={styles.changePhotoText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Username Section */}
          <View style={styles.usernameContainer}>
            {isEditing ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.usernameInput}
                  value={newUsername}
                  onChangeText={setNewUsername}
                  placeholder="Enter new username"
                  placeholderTextColor="#8a8a8a"
                  autoCapitalize="none"
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setNewUsername(userData.username)
                      setIsEditing(false)
                    }}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={saveChanges}
                    disabled={isLoading}
                  >
                    <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.username}>{userData.username}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                  <Text style={styles.editButtonText}>Edit Username</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Level and XP Section */}
        <View style={styles.levelContainer}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelLabel}>Level {userData.level}</Text>
            <Text style={styles.xpText}>
              {userData.xp_current} / {userData.xp_next_level} XP
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${xpProgress}%` }]} />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.learning_streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.completed_courses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userData.coding_points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Account Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{userData.email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Member Since</Text>
            <Text style={styles.detailValue}>{formatDate(userData.created_at)}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Last Login</Text>
            <Text style={styles.detailValue}>{formatDate(userData.last_login)}</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>My Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
            {userData.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <Text style={styles.badgeDescription}>{badge.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => Alert.alert("Sign Out", "You have been signed out")}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121628", // Dark blue background matching the screenshot
  },


  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2a2f4a",
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6c5ce7", // Purple accent color
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  changePhotoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  usernameContainer: {
    alignItems: "center",
    width: "100%",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#6c5ce7",
    borderRadius: 15,
    marginTop: 5,
  },
  editButtonText: {
    color: "#6c5ce7",
    fontSize: 14,
  },
  editContainer: {
    width: "100%",
  },
  usernameInput: {
    borderWidth: 1,
    borderColor: "#2a2f4a",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#1e2235",
    color: "white",
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2a2f4a",
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#6c5ce7",
    marginLeft: 5,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  levelContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelLabel: {
    color: "#6c5ce7",
    fontWeight: "bold",
    fontSize: 16,
  },
  xpText: {
    color: "#8a8a8a",
    fontSize: 14,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#2a2f4a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#6c5ce7",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1e2235",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6c5ce7",
  },
  statLabel: {
    fontSize: 14,
    color: "#8a8a8a",
    marginTop: 5,
  },
  section: {
    backgroundColor: "#1e2235",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2f4a",
  },
  detailLabel: {
    fontSize: 16,
    color: "#8a8a8a",
  },
  detailValue: {
    fontSize: 16,
    color: "white",
  },
  badgesSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  badgesScroll: {
    marginTop: 10,
  },
  badgeCard: {
    backgroundColor: "#1e2235",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    alignItems: "center",
    width: 140,
  },
  badgeIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  badgeName: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  badgeDescription: {
    color: "#8a8a8a",
    fontSize: 12,
    textAlign: "center",
  },
  signOutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: "#ff4757",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
