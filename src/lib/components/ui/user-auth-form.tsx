"use client";

import * as React from "react";
import { auth } from "@/lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useRouter } from "next/navigation"; // Use router directly in the component body
import { cn } from "@/lib/utils";
import { Icons } from "@/lib/components/icons/icons";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement> & {
  onSignUpSuccess?: () => void;
};

export function UserAuthForm({
  className,
  onSignUpSuccess,
  ...props
}: UserAuthFormProps) {
  const router = useRouter(); // Call useRouter directly here
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true); // Only control component mount state here
  }, []);

  if (!isMounted) {
    return null; // Ensure the component is mounted before rendering
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const email = (event.target as any).email.value;
    const password = (event.target as any).password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      if (onSignUpSuccess) {
        onSignUpSuccess();
      } else {
        // Use router directly to navigate
        router.push("/verify-email");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating user:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
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
          <Button className="mt-4 h-[50px]" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
}
