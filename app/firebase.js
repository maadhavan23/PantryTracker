// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoSuhAxDAyrg-drYHGUPIyA-XJ53hEw4Y",
  authDomain: "pantryapp-4ffb8.firebaseapp.com",
  projectId: "pantryapp-4ffb8",
  storageBucket: "pantryapp-4ffb8.appspot.com",
  messagingSenderId: "5889107122",
  appId: "1:5889107122:web:70a8fc0051a013c188d5ab",
  measurementId: "G-MLY9JJ4386"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optionally, only include analytics on the client side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app); // Optional, only if you need Analytics
}

const firestore = getFirestore(app);

export { app, firestore, analytics };
