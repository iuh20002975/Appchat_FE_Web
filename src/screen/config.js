import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOpTXrLQ7FlC1UaDM9uyeDNIHD0sn7qxI",
  authDomain: "phone-c43c0.firebaseapp.com",
  projectId: "phone-c43c0",
  storageBucket: "phone-c43c0.appspot.com",
  messagingSenderId: "452964407979",
  appId: "1:452964407979:web:4716214a1dbd7baade75ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);