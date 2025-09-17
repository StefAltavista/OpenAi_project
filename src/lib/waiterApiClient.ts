import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import { Dispatch, SetStateAction } from "react";

export function getInitialWaiterValue(): Session {
  return {
    id: crypto.randomUUID(),
    step: "WELCOME",
    history: [],
  };
}

export const sendWaiterMessage = async (
  input: string,
  session: Session,
  setSession: Dispatch<SetStateAction<Session>>
): Promise<Session | null> => {
  if (!session) return null;

  const message = {
    role: "user",
    content: input,
  };

  const newSession: Session = { ...session, history: [...session.history, message] };
  setSession(newSession); //add user comment to session => Serve ancora?
  const returnedSession = await sessionStep(newSession, "/api/waiter"); //get api response
  setSession(returnedSession);
  return returnedSession;
};

export const selectCookMessage = async (cookID: string, session: Session, setSession: Dispatch<SetStateAction<Session>>) => {
  if (!session) return;

  const newSession: Session = { ...session, selectedCookId: cookID };
  const returnedSession = await sessionStep(newSession, "/api/waiter");
  setSession(returnedSession);
};
