"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Modal from "react-native-modal"
import axios from "axios"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

// Import Screens 
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import LearningAppHome from "./screens/LearningAppHome"
import DocumentScreen from "./screens/DocumentScreen"
import EventsScreen from "./screens/EventsScreen" 
import QuizzComponent from "./components/QuizzComponent"
import LogoScreen from "./screens/LogoScreen"
import SubjectScreen from "./screens/SubjectScreen"
import LearningpathScreen from "./screens/LearningpathScreen"
import Explore from "./components/Explore"
import TopicQuizzes from "./screens/TopicQuizzes"
import SavedItems from "./screens/SavedItems"
import ProgressScreen from "./screens/ProgressScreen"


const Stack = createNativeStackNavigator()

export default function App() {
  const [currentRouteName, setCurrentRouteName] = useState("logo")
  return (
    <View style={{ flex: 1 }}> 
      {/* Navigation Container to handle screen changes */}
      <NavigationContainer
        onStateChange={(state) => {
          const route = state?.routes?.[state.index]
          if (route?.name) {
            setCurrentRouteName(route.name)
          }
        }}
      >
        <Stack.Navigator initialRouteName="logo">
          <Stack.Screen name="logo" component={LogoScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Sign Up" component={SignupScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={LearningAppHome ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Subjects" component={SubjectScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Document" component={DocumentScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
          <Stack.Screen name="Quizz" component={QuizzComponent ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
           <Stack.Screen name="events" component={EventsScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
           <Stack.Screen name="learningpath" component={LearningpathScreen ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
           <Stack.Screen name="Explore" component={Explore ?? (() => <Text>Error: Subject screen missing</Text>)} options={{ headerShown: false }} />
<Stack.Screen name="TopicQuizzes" component={TopicQuizzes} />
<Stack.Screen name="SavedItems" component={SavedItems} />
<Stack.Screen name="Progress" component={ProgressScreen} />

        </Stack.Navigator>
      </NavigationContainer>

      {/* Render AI Assistant except on Login and Sign Up screens */}
      {currentRouteName !== "Login" && currentRouteName !== "Sign Up" && currentRouteName !== "logo"&& <AIAssistant />}
    </View>
  )
}

// *aI assistant
function AIAssistant() {
  const [isModalVisible, setModalVisible] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const toggleModal = () => setModalVisible(!isModalVisible)

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage = { sender: "user", text: inputText }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputText("")
    setIsLoading(true)

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: inputText },
          ],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            "Content-Type": "application/json",
          },
        },
      )

      const botMessage = { sender: "bot", text: response.data.choices[0].message.content }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "Sorry, something went wrong!" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.messagesContainer}
          />
          {isLoading && <Text style={styles.loadingText}>Thinking...</Text>}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor="gray"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity> 
          </View>
        </View>
      </Modal>
    </>
  )
}

/********************************************
 Document Handling & Sharing Function *
 ********************************************/
async function handleOpenDocument(url) {
  const fileName = url.split("/").pop()
  const fileUri = FileSystem.documentDirectory + fileName

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri)
    if (!fileInfo.exists) {
      const { uri } = await FileSystem.downloadAsync(url, fileUri)
      await Sharing.shareAsync(uri)
    } else {
      await Sharing.shareAsync(fileUri)
    }
  } catch (error) {
    console.error("Error opening document:", error)
    Alert.alert("Error", "Failed to open the document: " + error.message)
  } 
}


const styles = StyleSheet.create({
  
  // Styles for AI Assistant and Modal

  floatingButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#8080D7",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1c1c1e",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  messagesContainer: {
    paddingBottom: 20,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#6C63FF",
    alignSelf: "flex-end",
    maxWidth: "80%",
  },
  botMessage: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  loadingText: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 20,
  },
});




