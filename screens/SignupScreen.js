"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal } from "react-native"
import { auth } from "../services/firebaseConfig"

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [className, setClassName] = useState("")
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false)

  const handleSignup = () => {
    navigation.navigate("Home", {
      firstName,
      lastName,
      userClass: className,
      selectedSchool,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <View style={styles.nameContainer}>
            <View style={styles.nameInput}>
              <Text style={styles.labelText}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="gray"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.nameInput}>
              <Text style={styles.labelText}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="gray"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Text style={styles.labelText}>Email Address / Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email or phone"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.labelText}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.labelText}>School</Text>
          <TouchableOpacity style={styles.schoolSelector} onPress={() => setIsSchoolModalVisible(true)}>
            <Text style={styles.schoolSelectorText}>
              {selectedSchool ? schools.find((s) => s.value === selectedSchool)?.label : "Select your school"}
            </Text>
          </TouchableOpacity>

          <SchoolSelectionModal
            visible={isSchoolModalVisible}
            onClose={() => setIsSchoolModalVisible(false)}
            selectedSchool={selectedSchool}
            onSelectSchool={setSelectedSchool}
          />

          <Text style={styles.labelText}>Class</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your class"
            placeholderTextColor="gray"
            value={className}
            onChangeText={setClassName}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
            <Text style={styles.loginButtonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Or sign up with:</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.noAccountText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const SchoolSelectionModal = ({ visible, onClose, selectedSchool, onSelectSchool }) => {
  const schools = [
    { label: "Herman Gmeinner", value: "school_a" },
    { label: "Alush Bardhi", value: "school_b" },
    { label: "Rreze Drite", value: "school_c" },
  ]

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select your school</Text>
          {schools.map((school) => (
            <TouchableOpacity
              key={school.value}
              style={[styles.schoolOption, selectedSchool === school.value && styles.selectedSchoolOption]}
              onPress={() => {
                onSelectSchool(school.value)
                onClose()
              }}
            >
              <Text
                style={[styles.schoolOptionText, selectedSchool === school.value && styles.selectedSchoolOptionText]}
              >
                {school.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171f36",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#A5A6F6",
    marginBottom: 8,
    paddingTop:40,
    paddingBottom: 20,
  },
  inputContainer: {
    flex: 1,
  },
  labelText: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#A5A6F6",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  socialButtonText: {
    color: "#A5A6F6",
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: "#A5A6F6",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "48%",
  },
  noAccountText: {
    color: "#A5A6F6",
    textAlign: "center",
    marginTop: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  nameInput: {
    flex: 0.48,
  },
  schoolSelector: {
    backgroundColor: "rgba(165, 166, 246, 0.1)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  schoolSelectorText: {
    color: "#A5A6F6",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#0B1120",
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#A5A6F6",
    marginBottom: 15,
    textAlign: "center",
  },
  schoolOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedSchoolOption: {
    backgroundColor: "rgba(165, 166, 246, 0.2)",
  },
  schoolOptionText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedSchoolOptionText: {
    color: "#A5A6F6",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#A5A6F6",
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#0B1120",
    fontSize: 16,
    fontWeight: "600",
  },
}) 

const schools = [
  { label: "Herman Gmeinner", value: "school_a" },
  { label: "Alush Bardhi", value: "school_b" },
  { label: "Rreze Drite", value: "school_c" },
]

export default SignupScreen




