// FirebasePersistence.tsx
"use client";

import { useEffect } from "react";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // Adjust the import based on your structure

const FirebasePersistence = () => {
  useEffect(() => {
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to local.");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, []);

  return null; // This component does not need to render anything
};

export default FirebasePersistence;
