"use client";
import { useEffect, useState } from "react";
import { Session } from "@/lib/switchWaiterSession";
import sessionStep from "@/lib/sessionStep";

export default function useInitSession() {
  const [sessionInit, setSessionInit] = useState<Session>();
  const [error, setError] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    createSession();
  }, []);
  const createSession = async () => {
    const init: Session = {
      id: crypto.randomUUID(),
      step: "WELCOME",
      history: [],
    };

    try {
      const session = await sessionStep(init);
      setSessionInit(session);
    } catch {
      setError("Failed to create session");
    } finally {
      setLoadingSession(false);
    }
  };

  return { sessionInit, error, loadingSession };
}
