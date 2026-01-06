// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-f38af.firebaseapp.com",
  projectId: "mern-estate-f38af",
  storageBucket: "mern-estate-f38af.firebasestorage.app",
  messagingSenderId: "1059277756304",
  appId: "1:1059277756304:web:f163794b1d72ed7d1e0515"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);