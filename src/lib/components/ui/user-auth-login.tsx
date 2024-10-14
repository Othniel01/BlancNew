"use client";

import * as React from "react";
import { auth } from "@/lib/firebaseConfig"; // Import the initialized auth instance
import { signInWithEmailAndPassword } from "firebase/auth"; // Use signInWithEmailAndPassword for login
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/components/icons/icons";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthLogin({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter(); // Initialize router

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    try {
      // Log in the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User logged in:", user);

      // Redirect to /home after successful login
      router.push("/home");
    } catch (err: any) {
      setError(err.message);
      console.error("Error logging in user:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-3">
          <div className="grid gap-3">
            <label htmlFor="email" className="text-xs">
              Email
            </label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            <label htmlFor="password" className="text-xs">
              Password
            </label>
            <Input
              id="password"
              placeholder="Enter password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button className="mt-4 h-[50px]" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}{" "}
          {/* Display error */}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
