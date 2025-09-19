import { cooks, Cook } from "@/data/cooks";
import getRandomCooks from "./getRandomCooks";
import { ai_assistant } from "./ai_assistant";
import { run } from "@openai/agents";

type WaiterState =
  | "WELCOME"
  | "ASK_RECIPE"
  | "PROPOSE_COOK"
  | "COOK_SELECTED"
  | "HANDOFF_TO_COOK"
  | "RETURN_FROM_PREVIOUS_COOK";

export interface Session {
  id: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  proposedCooks?: Cook[];
  selectedCookId?: string;
  usedCooksID?: { id: string }[];
  recipe?: string;
}

// Function to switch the state of the waiter session based on the current step
export async function switchWaiterState(session: Session) {
  switch (session.step) {
    // Initial greeting and asking about recipe
    case "WELCOME":
      session.history.push({
        role: "system",
        content:
          "Talk in italian: You are a digital Waiter in an app that provides recipes upon request. Greet and welcome the user  to our App Restaurant called SummerCamp Bistrò.",
      });
      session.step = "ASK_RECIPE";
      return session;

    // Asking about the recipe the user wants to discover
    case "ASK_RECIPE":
      session.history.push({
        role: "system",
        content:
          "Answer politelly to whatever the user says. Ask him what recipe would he like to discover. ",
      });
      session.step = "PROPOSE_COOK";
      return session;

    // Proposing a list of cooks based on the requested recipe
    case "PROPOSE_COOK":
      const bot = ai_assistant();
      const response = await run(
        bot,
        `extrapolate the name of the recipe from this message as "recipe": ${
          session.history[session.history.length - 1].content
        } `
      );
      if (!response.finalOutput) return;
      session.recipe = JSON.parse(response.finalOutput).recipe;

      const cooks_proposition = getRandomCooks(session.usedCooksID || []);
      session.history.push({
        role: "system",
        content: `Give a wierd feedback about the choice the user made, the choise was ${cooks.find(
          (c) => c.id == session.selectedCookId
        )} say goodbye and handoff to the cook to give the recipe`,
      });
      session.step = "COOK_SELECTED";
      session.proposedCooks = cooks_proposition;
      return session;

    // Handling the cook selection and handing off to the cook
    case "COOK_SELECTED":
      if (!session.selectedCookId) return;
      session.usedCooksID?.push({ id: session.selectedCookId });
      session.proposedCooks = undefined;
      session.step = "HANDOFF_TO_COOK";
      return session;

    // Handling the return from the previous cook
    case "RETURN_FROM_PREVIOUS_COOK":
      session.history.push({
        role: "system",
        content: `Welcome back the user, say that you are sorry that the previous cook could not help him, and that you will propose a new cook, based on his previous choice`,
      });
      const newCooks = getRandomCooks(session.usedCooksID || []);
      session.proposedCooks = newCooks;
      session.step = "COOK_SELECTED";
      return session;

    default:
      return session;
  }
}
