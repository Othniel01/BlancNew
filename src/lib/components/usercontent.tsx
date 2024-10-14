// UserContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // Adjust the import based on your structure

// Create a context for the user
const UserContext = createContext(null);

// UserProvider component to provide the user context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in the user's sign-in state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("User is signed in:", user);
      } else {
        setUser(null);
        console.log("No user is signed in.");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  return useContext(UserContext);
};
