import { CookSession } from "@/lib/switchCookState";
import { Dispatch, SetStateAction } from "react";
import sessionStep from "@/lib/sessionStep";

export function getInitialCookValue(cookID: string, recipe: string): CookSession {
  return {
    id: crypto.randomUUID(),
    step: "SALUTE",
    history: [],
    cookID,
    recipe,
  };
}

export const sendCookMessage = async (
  input: string,
  session: CookSession,
  setSession: Dispatch<SetStateAction<CookSession>>
): Promise<CookSession | null> => {
  if (!session) return null;

  const message = {
    role: "user",
    content: input,
  };

  const newSession: CookSession = { ...session, history: [...session.history, message] };
  setSession(newSession); //add user mesasge to session => Serve ancora?
  const returnedSession = await sessionStep(newSession, "/api/cook"); //get api response
  setSession(returnedSession);
  return returnedSession;
};
