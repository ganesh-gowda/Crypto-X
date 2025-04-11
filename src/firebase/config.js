// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxISBqC4KQVAhDeRm_VsKC4zNlZ7K_nFs",
  authDomain: "cryptox-46c33.firebaseapp.com",
  projectId: "cryptox-46c33",
  storageBucket: "cryptox-46c33.firebasestorage.app",
  messagingSenderId: "639160729053",
  appId: "1:639160729053:web:ccf781f13c4162ba048a34",
  measurementId: "G-1SM6LC3GDB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };