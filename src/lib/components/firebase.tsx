// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // For Realtime DB

// Your Firebase configuration (keep this as it is)
const firebaseConfig = {
  apiKey: "AIzaSyAp7ME-icGOU9XKmCHZAyy6fcyWE47qP9c",
  authDomain: "blancboard-a101a.firebaseapp.com",
  databaseURL: "https://blancboard-a101a-default-rtdb.firebaseio.com",
  projectId: "blancboard-a101a",
  storageBucket: "blancboard-a101a.appspot.com",
  messagingSenderId: "260326231417",
  appId: "1:260326231417:web:07ad1ac2f3edb80007b3a8",
  measurementId: "G-3L07TXCH7R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Function to create a user and store in Firebase DB
export async function registerUser(email: string, password: string) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Save user data to Firebase Realtime Database
    await set(ref(database, "users/" + user.uid), {
      email: user.email,
      uid: user.uid,
    });

    // Optionally, you can handle session creation here if needed
    console.log("User created successfully:", user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
