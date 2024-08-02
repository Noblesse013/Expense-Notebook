// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"
// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAopsOcbcnnDa-5Dl2Gtr-F80st3eOQ0mA",
  authDomain: "expense-fc071.firebaseapp.com",
  projectId: "expense-fc071",
  storageBucket: "expense-fc071.appspot.com",
  messagingSenderId: "415963854770",
  appId: "1:415963854770:web:f97d69956c447955a3d6ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)           //export the database