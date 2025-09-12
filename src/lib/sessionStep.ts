import { CookSession } from "./switchCookState";
import { Session } from "./switchWaiterState";

export default async function sessionStep(
  session: Session | CookSession,
  url: string
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });

  const newSession = await res.json();
  return newSession;
}
