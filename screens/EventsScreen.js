"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Calendar } from "react-native-calendars"
import NavBar from "../components/Navbar"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

// Event Data
const allEvents = [
  {
    id: "1",
    title: "AI Hackathon 2025",
    date: "2025-03-15",
    type: "Hackathon",
    description: "Join the ultimate AI challenge and showcase your skills.",
    tags: ["ai", "coding", "competition"]
  },
  {
    id: "2",
    title: "Summer Internship at Google",
    date: "2025-06-01",
    type: "Internship",
    description: "A great opportunity to work with Google engineers.",
    tags: ["career", "professional", "summer"]
  },
  {
    id: "3",
    title: "Web Development Bootcamp",
    date: "2025-04-10",
    type: "Training",
    description: "Learn full-stack web development with hands-on projects.",
    tags: ["coding", "web", "learning"]
  },
  {
    id: "4",
    title: "Cybersecurity Workshop",
    date: "2025-03-28",
    type: "Workshop",
    description: "Learn ethical hacking and security best practices.",
    tags: ["security", "coding", "workshop"]
  },
  {
    id: "5",
    title: "Mobile App Development Seminar",
    date: "2025-05-15",
    type: "Training",
    description: "Discover the latest trends in mobile app development.",
    tags: ["coding", "mobile", "learning"]
  },
  {
    id: "6",
    title: "Data Science Conference",
    date: "2025-07-20",
    type: "Conference",
    description: "Connect with data scientists and machine learning experts.",
    tags: ["data", "ai", "networking"]
  },
  {
    id: "7",
    title: "Microsoft Career Fair",
    date: "2025-04-25",
    type: "Career",
    description: "Meet recruiters and learn about job opportunities at Microsoft.",
    tags: ["career", "professional", "networking"]
  }
]

// Function to get icons based on event type
const getIcon = (type) => {
  switch (type) {
    case "Hackathon":
      return "code"
    case "Internship":
      return "briefcase"
    case "Training":
      return "book"
    case "Workshop":
      return "shield"
    case "Conference":
      return "users"
    case "Career":
      return "award"
    default:
      return "calendar"
  }
}

// Filter options for events
const filterOptions = [
  { name: "All Events", type: "all" },
  { name: "Hackathons", type: "eventType", value: "Hackathon" },
  { name: "Training", type: "eventType", value: "Training" },
  { name: "Workshops", type: "eventType", value: "Workshop" },
  { name: "Internships", type: "eventType", value: "Internship" },
  { name: "Career Events", type: "eventType", value: "Career" },
  { name: "Conferences", type: "eventType", value: "Conference" },
  { name: "Coding Events", type: "tag", value: "coding" },
  { name: "AI Events", type: "tag", value: "ai" },
  { name: "Career Events", type: "tag", value: "career" },
  { name: "Web Development", type: "tag", value: "web" },
  { name: "Security", type: "tag", value: "security" }
]

// Events Screen Component
const EventsScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState({ name: "All Events", type: "all" })
  const [filteredEvents, setFilteredEvents] = useState(allEvents)
  const [isCalendarVisible, setIsCalendarVisible] = useState(true)
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false)

  // Filter events based on search query, selected date, and active filter
  useEffect(() => {
    filterEvents()
  }, [searchQuery, selectedDate, activeFilter])

  const filterEvents = () => {
    const query = searchQuery.toLowerCase().trim()
    
    let filtered = allEvents

    // Apply date filter if selected
    if (selectedDate) {
      filtered = filtered.filter(event => event.date === selectedDate)
    }

    // Apply search query filter
    if (query !== "") {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply type and tag filters
    if (activeFilter.type !== "all") {
      filtered = filtered.filter(event => {
        if (activeFilter.type === "eventType") {
          return event.type === activeFilter.value
        } else if (activeFilter.type === "tag") {
          return event.tags.includes(activeFilter.value)
        }
        return true
      })
    }

    setFilteredEvents(filtered)
  }

  // Select filter
  const selectFilter = (filter) => {
    setActiveFilter(filter)
    setIsFilterDropdownVisible(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter({ name: "All Events", type: "all" })
    setSearchQuery("")
    setSelectedDate(null)
  }

  // Toggle calendar visibility
  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible)
  }

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setIsFilterDropdownVisible(!isFilterDropdownVisible)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "right", "left"]}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Upcoming Events</Text>
            <TouchableOpacity 
              style={styles.calendarToggle}
              onPress={toggleCalendar}
            >
              <Feather name={isCalendarVisible ? "calendar-off" : "calendar"} size={20} color="#6C63FF" />
            </TouchableOpacity>
          </View>

          {/* Search bar and filter dropdown */}
          <View style={styles.searchAndFilterContainer}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={16} color="#6C63FF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                placeholderTextColor="rgba(230,230,250,0.6)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== "" && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery("")}
                  style={styles.clearSearch}
                >
                  <Feather name="x" size={16} color="#6C63FF" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={toggleFilterDropdown}
            >
              <Feather name="filter" size={16} color="#6C63FF" />
            </TouchableOpacity>
          </View>
          
          {/* Active filter display */}
          <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterLabel}>Filter: </Text>
            <Text style={styles.activeFilterValue}>{activeFilter.name}</Text>
            
            {/* Clear filters button */}
            {(activeFilter.type !== "all" || searchQuery !== "" || selectedDate) && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter dropdown */}
          {isFilterDropdownVisible && (
            <View style={styles.filterDropdown}>
              <ScrollView>
                {filterOptions.map((filter, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.filterOption,
                      activeFilter.name === filter.name && styles.activeFilterOption
                    ]}
                    onPress={() => selectFilter(filter)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      activeFilter.name === filter.name && styles.activeFilterOptionText
                    ]}>
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Calendar (conditionally rendered) */}
          {isCalendarVisible && (
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString === selectedDate ? null : day.dateString)}
              markedDates={{
                ...allEvents.reduce((acc, event) => {
                  acc[event.date] = { marked: true, dotColor: "#FF6347" } // Tomato Red for event dates
                  return acc
                }, {}),
                [selectedDate]: { selected: true, marked: true, selectedColor: "#6C63FF" } // Primary Purple for selected date
              }}
              theme={{
                selectedDayBackgroundColor: "#6C63FF", // Primary Purple
                arrowColor: "#6C63FF", // Primary Purple
                monthTextColor: "#E6E6FA", // Light Lavender
                textSectionTitleColor: "#D8BFD8", // Light Lilac
                calendarBackground: "#171f36", // Dark Blue Background
                dayTextColor: "#E6E6FA", // Light Lavender
                todayTextColor: "#FF6347", // Red for today
              }}
              style={styles.calendar}
            />
          )}

          {/* No results message */}
          {filteredEvents.length === 0 && (
            <View style={styles.noResults}>
              <Feather name="calendar-off" size={50} color="rgba(230,230,250,0.5)" />
              <Text style={styles.noResultsText}>No events found</Text>
              <Text style={styles.noResultsSubtext}>Try different search terms or filters</Text>
            </View>
          )}

          {/* Events list */}
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Feather name={getIcon(item.type)} size={24} color="#6C63FF" style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <View style={styles.tagRow}>
                    {item.tags.map((tag, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.tag}
                        onPress={() => {
                          // Set this tag as active filter
                          const tagFilter = filterOptions.find(f => f.type === "tag" && f.value === tag);
                          if (tagFilter) {
                            selectFilter(tagFilter);
                          }
                        }}
                      >
                        <Text style={styles.tagText}>#{tag}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={[
              styles.listContent,
              filteredEvents.length === 0 && { flexGrow: 1 }
            ]}
          />
        </View>

        {/* NavBar is placed here to ensure it's always visible */}
        <NavBar navigation={navigation} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#171f36",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#E6E6FA",
  },
  calendarToggle: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  searchAndFilterContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(230,230,250,0.1)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#E6E6FA",
    fontSize: 14,
  },
  clearSearch: {
    padding: 5,
  },
  filterButton: {
    backgroundColor: "rgba(230,230,250,0.1)",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  activeFilterLabel: {
    color: "#D8BFD8",
    fontSize: 14,
  },
  activeFilterValue: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  filterDropdown: {
    backgroundColor: "#272f47",
    borderRadius: 10,
    padding: 10,
    maxHeight: 200,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(230,230,250,0.2)",
    zIndex: 100,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  activeFilterOption: {
    backgroundColor: "rgba(108,99,255,0.2)",
  },
  filterOptionText: {
    color: "#E6E6FA",
    fontSize: 14,
  },
  activeFilterOptionText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255,99,71,0.2)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#FF6347",
  },
  clearButtonText: {
    color: "#FF6347",
    fontSize: 12,
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 100, // Extra padding at the bottom for NavBar
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#272f47", // Dark Purple
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-start",
  },
  icon: { 
    marginRight: 15,
    marginTop: 3
  },
  textContainer: { 
    flex: 1 
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#E6E6FA" 
  },
  date: { 
    fontSize: 14, 
    color: "#D8BFD8", 
    marginVertical: 3 
  },
  description: { 
    fontSize: 14, 
    color: "#E6E6FA",
    opacity: 0.8,
    marginBottom: 8 
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(108,99,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#6C63FF",
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    color: "#E6E6FA",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  noResultsSubtext: {
    color: "rgba(230,230,250,0.6)",
    fontSize: 14,
    marginTop: 5,
  },
})

export default EventsScreen