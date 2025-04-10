import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import {  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth"
import { auth } from "../services/firebaseConfig";

const providerGoogle = new GoogleAuthProvider();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginPassword = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in user:', user.email);
      navigation.navigate('Home'); 
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLoginGoogle = () => {
      signInWithPopup(auth, providerGoogle)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log("Logged in")
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(error)
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
  });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        
        style={styles.content}
      >
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.labelText}>Email Address / Phone Number</Text> 
          <TextInput
            style={styles.input}
            placeholder="Placeholder"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail} 
          />

          <Text style={styles.labelText}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Placeholder"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Text style={styles.passwordHint}>
            It must be a combination of minimum 8 letters, numbers, and symbols.
          </Text>

          <View style={styles.rememberContainer}>
            <TouchableOpacity 
              style={styles.rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPassword}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>


          <Text style={styles.orText}>Or log in with:</Text>

          <TouchableOpacity style={styles.socialButton} onPress={handleLoginGoogle}>
            <Text style={styles.socialButtonText}>G Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}> Apple</Text>
          </TouchableOpacity> 

          <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
            <Text style={styles.noAccountText}>
              No account yet? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171f36',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop:60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#A5A6F6',
    marginBottom: 30,
    
  },
  inputContainer: {
    flex: 1,
  },
  labelText: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    marginBottom: 20,
  },
  passwordHint: {
    color: '#666',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A5A6F6',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#A5A6F6',
  },
  rememberText: {
    color: '#fff',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#A5A6F6',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#A5A6F6',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#A5A6F6',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  socialButtonText: {
    color: '#A5A6F6',
    fontSize: 16,
  },
  noAccountText: {
    color: '#A5A6F6',
    textAlign: 'center',
    marginTop: 20,
  },

});


export default LoginScreen;
