import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, ProgressBarAndroid, ProgressViewIOS } from "react-native";

function ProgressScreen() {
  // Dummy data for progress
  const progressData = [
    { id: 1, title: "Mathematics", progress: 0.75 },
    { id: 2, title: "Science", progress: 0.5 },
    { id: 3, title: "History", progress: 0.9 },
    { id: 4, title: "Literature", progress: 0.3 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Progress</Text>
        {progressData.map((item) => (
          <View key={item.id} style={styles.progressCard}>
            <Text style={styles.subjectTitle}>{item.title}</Text>
            {Platform.OS === "ios" ? (
              <ProgressViewIOS
                style={styles.progressBar}
                progress={item.progress}
                progressTintColor="#4caf50"
                trackTintColor="#e0e0e0"
              />
            ) : (
              <ProgressBarAndroid
                style={styles.progressBar}
                styleAttr="Horizontal"
                indeterminate={false}
                progress={item.progress}
                color="#4caf50"
              />
            )}
            <Text style={styles.progressText}>{Math.round(item.progress * 100)}% Complete</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#171f36",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: "#272f47",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default ProgressScreen;