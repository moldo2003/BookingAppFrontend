// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMOw96XUyThcN5lgxUPtRgtOxPoZoS_N4",
  authDomain: "aplicatieprogramari-8e7db.firebaseapp.com",
  projectId: "aplicatieprogramari-8e7db",
  storageBucket: "aplicatieprogramari-8e7db.appspot.com",
  messagingSenderId: "682186672163",
  appId: "1:682186672163:web:f2e35c0cf005e0b15e8996",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH =
  Platform.OS === "web"
    ? initializeAuth(FIREBASE_APP)
    : initializeAuth(FIREBASE_APP, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
