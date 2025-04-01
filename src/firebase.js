import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs8TzjOA3W639o9Er34C48_O7pv3Utyik",
  authDomain: "visiting-card-11aee.firebaseapp.com",
  projectId: "visiting-card-11aee",
  storageBucket: "visiting-card-11aee.firebasestorage.app",
  messagingSenderId: "281820020891",
  appId: "1:281820020891:web:e714d982bdeff4551b463e"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔹 Authentication Functions
const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
const logout = () => signOut(auth);

export { auth, signInWithGoogle, signInWithEmail, registerWithEmail, logout };