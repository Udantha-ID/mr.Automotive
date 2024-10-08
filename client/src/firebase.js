// Import functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-tourism.firebaseapp.com",
  projectId: "mern-tourism",
  storageBucket: "mern-tourism.appspot.com",
  messagingSenderId: "633102065102",
  appId: "1:633102065102:web:2b05b0be2b7bfa421a1f9f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };
