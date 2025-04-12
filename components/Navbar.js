import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";


export function NavBar({showOverlay}) {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route

  // Function to show the explore overlay
  const showExploreOverlay = () => {
    // Check if we're on the home screen using the route.name
    if (route.name === "Home") {
      // Trigger the explore overlay directly on the current screen
      const event = {
        overlayType: 'explore',
        action: 'show',
      };
      navigation.setParams({ showOverlay: event });
    } else {
      // If not on home screen, navigate to home and show overlay
      navigation.navigate("Home", { 
        showOverlay: {
          overlayType: 'explore',
          action: 'show',
        },
      });
    }
  };



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <Feather name="home" size={24} color={route.name === "Home" ? "white" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.navText, route.name === "Home" && styles.navActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => showOverlay("search")}>
          <Feather name="compass" size={24} color={route.name === "Explore" ? "white" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.navText, route.name === "Explore" && styles.navActive]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate("SavedItems")}
        >
          <Feather name="bookmark" size={24} color={route.name === "SavedItems" ? "white" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.navText, route.name === "SavedItems" && styles.navActive]}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={24} color={route.name === "Profile" ? "white" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.navText, route.name === "Profile" && styles.navActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#10162a",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#10162a",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginTop: 5,
  },
  navActive: {
    color: "#ffffff",
  },
});

export default NavBar;