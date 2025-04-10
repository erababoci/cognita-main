import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

export default function LogoScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    // Step 1: Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, 
      useNativeDriver: true,
    }).start(() => {
      // Step 2: Fade out animation before navigating
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000, 
          useNativeDriver: true,
        }).start(() => {
          navigation.replace('Login'); 
        });
      }, 1000); 
    }); 
  },);

  return (
    <View style={styles.container}>
      {/* Animated Logo with Fade Effect */}
      <Animated.Image 
        source={require('../assets/cognitaClogo.png')} 
        style={[styles.logo, { opacity: fadeAnim }]} 
      />
    </View>
  );
}

// Styles for splash screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    width: 300,  
    height: 250,
  },
});

