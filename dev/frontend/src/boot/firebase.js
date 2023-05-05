// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ73X8kfob6B_N3AiYMGI3m5lmcz2aQxM",
  authDomain: "javascript-study-4f3a1.firebaseapp.com",
  databaseURL: "https://javascript-study-4f3a1-default-rtdb.firebaseio.com",
  projectId: "javascript-study-4f3a1",
  storageBucket: "javascript-study-4f3a1.appspot.com",
  messagingSenderId: "1072792802696",
  appId: "1:1072792802696:web:9d60b326b554229246563d",
  measurementId: "G-DHGYFQZF2F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { db };
