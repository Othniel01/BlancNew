"use client";

import { applyActionCode } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";

export default function Verify() {
  const searchParams = useSearchParams();
  const actionCode = searchParams.get("oobCode"); // Get the 'oobCode' from URL
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("All search params:", searchParams.toString()); // Log all URL parameters for debugging
    console.log("Verification code (oobCode):", actionCode); // Log the 'oobCode'

    async function verifyEmail() {
      if (actionCode) {
        try {
          // Apply the verification code using Firebase
          await applyActionCode(auth, actionCode);
          setIsVerifying(false);
          console.log("Email verification successful");

          // Redirect to login page after verification
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } catch (error) {
          console.error("Error applying action code:", error);
          setError("Invalid or expired verification code.");
        }
      } else {
        console.error("No action code found in the URL.");
        setError("Invalid verification link.");
      }
    }

    verifyEmail();
  }, [actionCode, searchParams, router]);

  if (isVerifying) {
    return <p>Verifying your email, please wait...</p>;
  }

  return error ? <p>{error}</p> : null;
}
