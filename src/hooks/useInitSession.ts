"use client";
import { useEffect, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import { CookSession } from "@/lib/switchCookState";

export default function useInitSession<T extends Session | CookSession>(
  init: T,
  url: string
) {
  const [sessionInit, setSessionInit] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    try {
      const session = await sessionStep(init, url);
      setSessionInit(session);
    } catch {
      setError("Failed to create session");
    } finally {
      setLoadingSession(false);
    }
  };

  return { sessionInit, error, loadingSession };
}
