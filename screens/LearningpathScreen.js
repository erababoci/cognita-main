import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavBar from "../components/Navbar";

const LearningpathScreen = ({ navigation }) => {
  // Define the learning path nodes
  const pathNodes = [
    { id: 1, label: "Start", color: "#c9d45c", completed: true, isStart: true },
    { id: 2, color: "#ffffff", completed: true },
    { id: 3, color: "#5acad8", completed: true },
    { id: 4, color: "#f5a742", completed: false, hasPlayButton: true },
    { id: 5, color: "#8c8c8c", completed: false },
    { id: 6, color: "#8c8c8c", completed: false },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "right", "left"]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Learning path</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Text style={styles.infoButtonText}>i</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pathContainer}>
          {/* Render the learning path */}
          <View style={styles.pathLine} />
          
          {/* Render each node */}
          {pathNodes.map((node, index) => (
            <View 
              key={node.id} 
              style={[
                styles.nodeContainer,
                { top: 80 + index * 120 }
              ]}
            >
              {/* Path segment with appropriate curve */}
              {index < pathNodes.length - 1 && (
                <View 
                  style={[
                    styles.pathSegment,
                    index % 2 === 0 ? styles.pathSegmentRight : styles.pathSegmentLeft
                  ]} 
                />
              )}
              
              {/* Node circle */}
              <TouchableOpacity
                style={[
                  styles.node,
                  { backgroundColor: node.color },
                  node.completed ? styles.nodeCompleted : {}
                ]}
              >
                {node.isStart && (
                  <Text style={styles.nodeLabel}>Start</Text>
                )}
                {node.hasPlayButton && (
                  <Play color="#171f36" size={24} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
      
      {/* NavBar outside of SafeAreaView to ensure it's at the bottom */}
      <View style={styles.navBarContainer}>
        <NavBar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171f36", 
    position: "relative", 
  },
  safeArea: {
    flex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  infoButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pathContainer: {
    flex: 1,
    position: "relative",
  },
  pathLine: {
    position: "absolute",
    width: 8,
    height: "100%",
    backgroundColor: "#3a4257",
    left: "50%",
    marginLeft: -4,
    zIndex: 1,
  },
  nodeContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    zIndex: 2,
  },
  node: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#171f36",
  },
  nodeCompleted: {
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  nodeLabel: {
    position: "absolute",
    top: -30,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pathSegment: {
    position: "absolute",
    width: 120,
    height: 120,
    borderWidth: 8,
    borderColor: "#3a4257",
    backgroundColor: "transparent",
    zIndex: 1,
  },
  pathSegmentRight: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 120,
    borderTopLeftRadius: 0,
    right: "25%",
    top: 30,
  },
  pathSegmentLeft: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 120,
    left: "25%",
    top: 30,
  },
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default LearningpathScreen;