import { cooks, Cook } from "@/data/cooks";
import getRandomCooks from "./getRandomCooks";
import { ai_assistant } from "./ai_assistant";
import { run } from "@openai/agents";

type WaiterState = "WELCOME" | "ASK_RECIPE" | "PROPOSE_COOK" | "COOK_SELECTED";

export interface Session {
  id: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  proposedCooks?: Cook[];
  selectedCookId?: string;
  usedCooksID?: { id: string }[];
  recipe?: string;
}

export async function switchWaiterState(session: Session) {
  switch (session.step) {
    case "WELCOME":
      session.history.push({
        role: "system",
        content:
          " You are a digital Waiter in an app that provides recipes upon request. Greet and welcome the user  to our App Restaurant called SummerCamp Bistrò.",
      });
      session.step = "ASK_RECIPE";
      return session;

    case "ASK_RECIPE":
      session.history.push({
        role: "system",
        content:
          "Answer politelly to whatever the user says. Ask him what recipe would he like to discover. ",
      });
      session.step = "PROPOSE_COOK";
      return session;

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
        content: `Be joyfull about the recipe they asked about, ask him to choose one of the proposed cooks`,
      });
      session.step = "COOK_SELECTED";
      session.proposedCooks = cooks_proposition;
      return session;

    case "COOK_SELECTED":
      session.history.push({
        role: "system",
        content: `Give a wierd feedback about the choice the user made, the choise was ${cooks.find(
          (c) => c.id == session.selectedCookId
        )} say goodbye and handoff to the cook to give the recipe`,
      });
      if (!session.selectedCookId) return;
      session.usedCooksID?.push({ id: session.selectedCookId });
      session.proposedCooks = undefined;
      session.step = "HANDOFF_TO_COOK";
      return session;

    default:
      return session;
  }
}
