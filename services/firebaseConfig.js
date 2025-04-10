import { initializeApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAKM36DMp6QtFLrzT1yH0dREhPcQe2j_x4",
  authDomain: "html-1-304e9.firebaseapp.com",
  projectId: "html-1-304e9",
  storageBucket: "html-1-304e9.firebasestorage.app",
  messagingSenderId: "712191186860",
  appId: "1:712191186860:web:198a90c23681c534c40c09",
  measurementId: "G-BTSQX1R81L"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

export { auth };