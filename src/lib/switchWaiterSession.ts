import { cooks, Cook } from "@/data/cooks";
import getRandomCooks from "./getRandomCooks";

type WaiterState =
  | "WELCOME"
  | "ASK_RECIPE"
  | "DISRUPTION"
  | "PROPOSE_COOK"
  | "COOK_SELECTED"
  | "HANDOFF_TO_COOK";

export interface Session {
  id: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  proposedCooks?: { id: string }[];
  selectedCookId?: string;
  usedCooksID?: string;

  selection?: string;
}
export function switchWaiterSession(session: Session) {
  switch (session.step) {
    case "WELCOME":
      session.history.push({
        role: "system",
        content:
          " You are a digital Waiter in an app that provides recipes upon request. First of all greet the user, welcome them to our App Restaurant called SummerCamp Bistrò. Ask them how they are doing today",
      });
      session.step = "ASK_RECIPE";
      return session;

    case "ASK_RECIPE":
      session.history.push({
        role: "system",
        content:
          "Answer politelly to whatever the user says. Ask him what recipe would he like to discover today.",
      });
      session.step = "PROPOSE_COOK";
      return session;

    case "PROPOSE_COOK":
      const cooks_proposition = getRandomCooks(session.usedCooksID || "");
      session.history.push({
        role: "system",
        content: `Be joyfull about the recipe they asked about, now you have to propose 3. 
                    Here are the cooks: ${cooks_proposition
                      .map((c: Cook) => `${c.name} ${c.character}`)
                      .join(", ")}`,
      });
      session.step = "COOK_SELECTED";
      session.proposedCooks = cooks_proposition;
      return session;

    case "COOK_SELECTED":
      session.selectedCookId = session.selection;
      session.history.push({
        role: "system",
        content: `Give a wierd feedback about the choice the user made, the choise was ${cooks.find(
          (c) => c.id == session.selection
        )}`,
      });
      session.step = "HANDOFF_TO_COOK";
      return session;

    default:
      return session;
  }
}
