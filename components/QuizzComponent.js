import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, StatusBar, SafeAreaView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import NavBar from "../components/Navbar"
import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

export default function QuizzComponent() {
  const navigation = useNavigation();
  const [savedItems, setSavedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Sample data for all quiz categories
  const allCategories = {
    "Computer Science": [
      {
        title: "Programming",
        description: "Multiple languages and paradigms.",
        icon: "code-tags",
        quizCount: 156,
        difficulty: 2,
        tags: ["coding", "development", "computer science"]
      },
      {
        title: "Databases",
        description: "SQL and NoSQL systems.",
        icon: "database",
        quizCount: 89,
        difficulty: 3,
        tags: ["data", "storage", "sql", "computer science"]
      },
      {
        title: "Algorithms",
        description: "Sorting, searching, and optimization.",
        icon: "chevron-right",
        quizCount: 64,
        difficulty: 2,
        tags: ["logic", "analysis", "computer science"]
      },
    ],
    "Web Development": [
      {
        title: "HTML/CSS",
        description: "Frontend basics and design.",
        icon: "web",
        quizCount: 78,
        difficulty: 1,
        tags: ["frontend", "design", "web"]
      },
      {
        title: "JavaScript",
        description: "Modern JS frameworks and vanilla code.",
        icon: "language-javascript",
        quizCount: 124,
        difficulty: 2,
        tags: ["frontend", "programming", "web"]
      },
      {
        title: "React",
        description: "Component-based UI development.",
        icon: "react",
        quizCount: 82,
        difficulty: 2,
        tags: ["frontend", "framework", "web"]
      },
    ],
    "Data Science": [
      {
        title: "Machine Learning",
        description: "AI, neural networks, and data science fundamentals.",
        icon: "brain",
        quizCount: 78,
        difficulty: 3,
        tags: ["ai", "algorithms", "data"]
      },
      {
        title: "Data Analysis",
        description: "Statistical methods and visualization.",
        icon: "chart-bar",
        quizCount: 63,
        difficulty: 2,
        tags: ["statistics", "visualization", "data"]
      },
      {
        title: "Python for Data",
        description: "Using Python for data processing.",
        icon: "language-python",
        quizCount: 91,
        difficulty: 2,
        tags: ["python", "programming", "data"]
      }
    ]
  };

  // Popular subjects for the horizontal scroll
  const popularSubjects = [
    {
      title: "Programming",
      description: "Test your coding skills across multiple languages and frameworks.",
      icon: "code-tags",
      quizCount: 156,
      difficulty: 2,
      featured: true,
      tags: ["coding", "development", "computer science"]
    },
    {
      title: "Databases",
      description: "Learn about SQL, NoSQL, and database design principles.",
      icon: "database",
      quizCount: 89,
      difficulty: 3,
      tags: ["data", "storage", "sql", "computer science"]
    },
    {
      title: "Web Development",
      description: "HTML, CSS, JavaScript and modern frameworks.",
      icon: "web",
      quizCount: 112,
      difficulty: 1,
      isNew: true,
      tags: ["frontend", "design", "web"]
    },
    {
      title: "Machine Learning",
      description: "AI, neural networks, and data science fundamentals.",
      icon: "brain",
      quizCount: 78,
      difficulty: 3,
      tags: ["ai", "algorithms", "data"]
    }
  ];

  // Define filter options
  const filterOptions = [
    { name: "Beginner", type: "difficulty", value: 1 },
    { name: "Intermediate", type: "difficulty", value: 2 },
    { name: "Advanced", type: "difficulty", value: 3 },
    { name: "Web", type: "tag", value: "web" },
    { name: "Data", type: "tag", value: "data" },
    { name: "Programming", type: "tag", value: "programming" }
  ];

  // Load saved items when component mounts
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const savedData = await AsyncStorage.getItem("savedItems");
        if (savedData) {
          setSavedItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Error loading saved items:", error);
      }
    };
    
    loadSavedItems();
  }, []);

  // Save items to AsyncStorage whenever savedItems changes
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        await AsyncStorage.setItem("savedItems", JSON.stringify(savedItems));
      } catch (error) {
        console.error("Error saving items:", error);
      }
    };
    
    saveToStorage();
  }, [savedItems]);

  // Filter categories based on search query and active filters
  useEffect(() => {
    // Function to check if a category matches the active filters
    const matchesFilters = (category) => {
      if (activeFilters.length === 0) return true;
      
      return activeFilters.every(filter => {
        if (filter.type === "difficulty") {
          return category.difficulty === filter.value;
        } else if (filter.type === "tag") {
          return category.tags.includes(filter.value);
        }
        return true;
      });
    };

    // Function to search categories and filter based on query and active filters
    const filterCategories = () => {
      const query = searchQuery.toLowerCase().trim();
      const filteredResults = {};
      
      // If no search query and no filters, return all categories
      if (query === "" && activeFilters.length === 0) {
        setFilteredCategories(allCategories);
        return;
      }
      
      // Filter categories based on search query and active filters
      Object.entries(allCategories).forEach(([section, categories]) => {
        const matchedCategories = categories.filter(category => {
          const titleMatch = category.title.toLowerCase().includes(query);
          const descMatch = category.description.toLowerCase().includes(query);
          const tagMatch = category.tags.some(tag => tag.toLowerCase().includes(query));
          const matchesQuery = query === "" || titleMatch || descMatch || tagMatch;
          
          return matchesQuery && matchesFilters(category);
        });
        
        if (matchedCategories.length > 0) {
          filteredResults[section] = matchedCategories;
        }
      });
      
      setFilteredCategories(filteredResults);
    };
    
    filterCategories();
  }, [searchQuery, activeFilters]);

  // Check if an item is saved
  const isItemSaved = (title) => {
    return savedItems.some(item => item.title === title);
  };

  // Toggle save status for an item
  const toggleSaveItem = (title, description, icon) => {
    if (isItemSaved(title)) {
      // Remove from saved items
      setSavedItems(savedItems.filter(item => item.title !== title));
      Alert.alert("Removed", `${title} removed from saved items`);
    } else {
      // Add to saved items
      setSavedItems([...savedItems, { title, description, icon }]);
      Alert.alert("Saved", `${title} saved successfully`);
    }
  };

  // Navigate to topic-specific quizzes
  const navigateToTopicQuizzes = (title) => {
    // You'll need to create this screen in your screens folder
    navigation.navigate("TopicQuizzes", { 
      topic: title,
      // You can pass additional data if needed
    });
  };

  // Toggle filter selection
  const toggleFilter = (filter) => {
    const isActive = activeFilters.some(
      item => item.type === filter.type && item.value === filter.value
    );
    
    if (isActive) {
      setActiveFilters(activeFilters.filter(
        item => !(item.type === filter.type && item.value === filter.value)
      ));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Filter chip component
  const FilterChip = ({ filter, active }) => (
    <TouchableOpacity 
      style={[styles.filterChip, active && styles.activeFilterChip]}
      onPress={() => toggleFilter(filter)}
    >
      <Text style={[styles.filterChipText, active && styles.activeFilterChipText]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#0b1023", "#1f2b49"]} style={styles.container} start={[0, 0]} end={[1, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for quizzes, topics, or keywords..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => {/* Additional search action if needed */}}
            >
              <Feather name="search" size={16} color="white" />
            </TouchableOpacity>

            
          </View>

          {/* Filter chips */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterOptions.map((filter, index) => (
                <FilterChip 
                  key={index} 
                  filter={filter} 
                  active={activeFilters.some(
                    item => item.type === filter.type && item.value === filter.value
                  )} 
                />
              ))}
              {(activeFilters.length > 0 || searchQuery !== "") && (
                <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {/* No results message */}
          {Object.keys(filteredCategories).length === 0 && (
            <View style={styles.noResults}>
              <MaterialCommunityIcons name="file-search-outline" size={50} color="rgba(255,255,255,0.5)" />
              <Text style={styles.noResultsText}>No quizzes found</Text>
              <Text style={styles.noResultsSubtext}>Try different search terms or filters</Text>
            </View>
          )}

          {/* Show popular subjects only when there's no search query */}
          {searchQuery === "" && activeFilters.length === 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Subjects</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Top Picks</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
                {popularSubjects.map((subject, index) => (
                  <CategoryCard
                    key={index}
                    title={subject.title}
                    description={subject.description}
                    icon={subject.icon}
                    quizCount={subject.quizCount}
                    difficulty={subject.difficulty}
                    featured={subject.featured}
                    isNew={subject.isNew}
                    isSaved={isItemSaved(subject.title)}
                    onSave={() => toggleSaveItem(subject.title, subject.description, subject.icon)}
                    onPress={() => navigateToTopicQuizzes(subject.title)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {/* Render filtered categories */}
          {Object.entries(filteredCategories).map(([section, categories]) => (
            <CategorySection
              key={section}
              title={section}
              categories={categories.map(category => ({
                ...category,
                isSaved: isItemSaved(category.title),
                onSave: () => toggleSaveItem(category.title, category.description, category.icon),
                onPress: () => navigateToTopicQuizzes(category.title)
              }))}
            />
          ))}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <View style={styles.navBarContainer}>
        <NavBar />
      </View>
    </LinearGradient>
  )
}

function CategoryCard({ 
  title, 
  description, 
  icon, 
  quizCount, 
  difficulty, 
  featured, 
  isNew, 
  isSaved, 
  onSave, 
  onPress 
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.badgeText}>Featured</Text>
        </View>
      )}
      {isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.badgeText}>New</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <MaterialCommunityIcons name={icon} size={24} color="white" />
          </View>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            <Feather 
              name="bookmark" 
              size={20} 
              color={isSaved ? "#6c5ce7" : "white"} 
              style={isSaved ? styles.savedIcon : {}}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.quizCount}>{quizCount} quizzes</Text>
          <View style={styles.difficulty}>
            {[1, 2, 3].map((dot) => (
              <View key={dot} style={[styles.difficultyDot, dot <= difficulty && styles.difficultyActive]} />
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function CategorySection({ title, categories }) {
  return (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <View style={styles.cardGrid}>
        {categories.map((category, index) => (
          <CategoryCard
            key={index}
            title={category.title}
            description={category.description}
            icon={category.icon}
            quizCount={category.quizCount}
            difficulty={category.difficulty}
            isSaved={category.isSaved}
            onSave={category.onSave}
            onPress={category.onPress}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // All existing styles...
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
    padding: 15,
    marginTop: -10,
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

  
  // New filter styles
  filterContainer: {
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  activeFilterChip: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },
  filterChipText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  activeFilterChipText: {
    color: "white",
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ff7675",
  },
  clearButtonText: {
    color: "#ff7675",
    fontSize: 12,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noResultsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  noResultsSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginTop: 5,
  },
  
  // Existing styles continued...
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  badge: {
    backgroundColor: "#6c5ce7",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  cardScroll: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    width: 250,
    marginRight: 15,
    position: "relative",
    marginBottom: 15,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  saveButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
  },
  savedIcon: {
    opacity: 1,
  },
  cardIcon: {
    backgroundColor: "rgba(255,255,255,0.1)",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  cardDescription: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizCount: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  difficulty: {
    flexDirection: "row",
    gap: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginLeft: 2,
  },
  difficultyActive: {
    backgroundColor: "#6c5ce7",
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff7675",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 1,
  },
  newBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#00b894",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 1,
  },
  categorySection: {
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 15,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
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
    color: "white",
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