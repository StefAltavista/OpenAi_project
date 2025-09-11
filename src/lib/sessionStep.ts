import { Session } from "./switchWaiterState";

export default async function sessionStep(session: Session) {
  const res = await fetch("/api/waiter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });

  const newSession = await res.json();
  return newSession;
}
