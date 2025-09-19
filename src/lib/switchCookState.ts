import { run } from "@openai/agents";
import { ai_assistant } from "./ai_assistant";

type WaiterState =
  | "SALUTE"
  | "ASK_ALLERGY"
  | "ASK_DIET"
  | "RANDOM_QUESTION"
  | "LIST_INGREDIENTS"
  | "END";

export interface CookSession {
  id: string;
  cookID: string;
  recipe: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  allergies?: string[];
  diet?: string[];
  ingredients?: string[];
}

export default async function switchCookState(
  session: CookSession
): Promise<CookSession> {
  const bot = ai_assistant();
  let response;
  switch (session.step) {
    case "SALUTE":
      session.history.push({
        role: "cook",
        content: `Say Hello to our guest, make a silly comment about the recipe and ask if the user is on a specific diet`,
      });
      session.step = "ASK_ALLERGY";
      return session;

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

    case "LIST_INGREDIENTS":
      session.history.push({
        role: "system",
        content: `Now give a wrong recipe... (at the end of the message also add a list of ingredients with random scales and maybe some allergens or non-dietary ingridients?) `,
      });
      session.step = "END";
      return session;

    case "END":
      return session;
    default:
      return session;
  }
}

// Passaggi possibili:

// chiedere se ha allergie o ingredinti che non ti piacciono
// chiedere se mangia carne & pesce o se è vegetariano o vegano
