import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from '../components/Navbar';

export default function SavedItems({ navigation }) {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedItems');
        if (savedData) {
          setSavedItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved items:', error);
      }
    };
    
    loadSavedItems();
    
    // Refresh the list when the screen is focused
    const unsubscribe = navigation.addListener('focus', loadSavedItems);
    return unsubscribe;
  }, [navigation]);

  const removeSavedItem = async (title) => {
    const updatedItems = savedItems.filter(item => item.title !== title);
    setSavedItems(updatedItems);
    
    try {
      await AsyncStorage.setItem('savedItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving updated items:', error);
    }
  };

  return (
    <LinearGradient colors={["#0b1023", "#1f2b49"]} style={styles.container} start={[0, 0]} end={[1, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
       

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {savedItems.length > 0 ? (
            savedItems.map((item, index) => (
              <SavedItemCard
                key={index}
                item={item}
                onPress={() => navigation.navigate('TopicQuizzes', { topic: item.title })}
                onRemove={() => removeSavedItem(item.title)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="bookmark-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>No saved items yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Save topics by tapping the bookmark icon on any card
              </Text>
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.browseButtonText}>Browse Topics</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </LinearGradient>
  );
}

function SavedItemCard({ item, onPress, onRemove }) {
  return (
    <TouchableOpacity style={styles.savedItemCard} onPress={onPress}>
      <View style={styles.savedItemContent}>
        <View style={styles.savedItemIcon}>
          <MaterialCommunityIcons name={item.icon} size={24} color="white" />
        </View>
        <View style={styles.savedItemInfo}>
          <Text style={styles.savedItemTitle}>{item.title}</Text>
          <Text style={styles.savedItemDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Feather name="x" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  savedItemCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  savedItemContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedItemIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  savedItemInfo: {
    flex: 1,
  },
  savedItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  savedItemDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyStateSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingBottom: 0,
  },
});