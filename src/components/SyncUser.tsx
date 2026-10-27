"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export function SyncUser() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetch("/api/auth/sync", { method: "POST" })
        .catch(console.error);
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
