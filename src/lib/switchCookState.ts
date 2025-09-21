import { run } from "@openai/agents";
import { ai_assistant } from "./ai_assistant";

type CookState =
  | "SALUTE"
  | "ASK_ALLERGY"
  | "ASK_DIET"
  | "RANDOM_QUESTION"
  | "LIST_INGREDIENTS"
  | "END"
  | "RETURN_TO_WAITER";

export interface CookSession {
  id: string;
  cookID: string;
  recipe: string;
  step: CookState;
  history: { role: string; content: string }[];
  allergies?: string[];
  diet?: string[];
  ingredients?: string[];
}

// Function to switch the state of the cook session based on the current step

export default async function switchCookState(
  session: CookSession
): Promise<CookSession> {
  const bot = ai_assistant();
  let response;
  switch (session.step) {
    // Initial greeting and asking about diet
    case "SALUTE":
      session.history.push({
        role: "cook",
        content: `Say Hello to our guest, make a silly comment about the recipe and ask if the user is on a specific diet`,
      });
      session.step = "ASK_ALLERGY";
      return session;

    // Asking about allergies and set value
    case "ASK_ALLERGY":
      response = await run(
        bot,
        `extrapolate the diets, if any, as "diet":string[]  from this message: ${
          session.history[session.history.length - 1].content
        } `
      );

      if (response.finalOutput) {
        try {
          session.diet = JSON.parse(response.finalOutput).diet;
          console.log(session.diet);
        } catch {
          session.diet = [""];
        }
      }
      session.history.push({
        role: "system",
        content: `ask if the user has any alleregies `,
      });
      session.step = "RANDOM_QUESTION";
      return session;

    // Asking a random question to make the chat more engaging/fun
    case "RANDOM_QUESTION":
      response = await run(
        bot,
        `extrapolate the allergies, if any, as "allergies":string[] from this message : ${
          session.history[session.history.length - 1].content
        } `
      );
      if (response.finalOutput) {
        try {
          session.allergies = JSON.parse(response.finalOutput).allergies;
          console.log(JSON.parse(response.finalOutput));
        } catch {
          session.allergies = [""];
        }
      }

      session.history.push({
        role: "system",
        content: `make a completely random question`,
      });
      session.step = "LIST_INGREDIENTS";
      return session;

    // Listing ingredients for the recipe(wrongly)
    case "LIST_INGREDIENTS":
      session.history.push({
        role: "system",
        content: `Now give a wrong recipe... (at the end of the message also add a list of ingredients with random scales and maybe some allergens or non-dietary ingridients?) `,
      });
      session.step = "END";
      return session;

    // Ending the session and handing back to the waiter
    case "END":
      session.history.push({
        role: "system",
        content: `Say goodbye to the user and handoff to the waiter, so that he can propose a new cook if needed`,
      });
      session.step = "RETURN_TO_WAITER";
      return session;

    // Handling the return to the waiter (not implemented here)
    case "RETURN_TO_WAITER":
      session.history.push({
        role: "system",
        content: `The cook session has ended. Returning to the waiter...`,
      });
      return session;

    // Default case to handle unexpected states
    default:
      return session;
  }
}
