// FirebaseAuthListener.tsx
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // Adjust the import based on your structure

const FirebaseAuthListener = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("No user is signed in.");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return null; // This component does not need to render anything
};

export default FirebaseAuthListener;
