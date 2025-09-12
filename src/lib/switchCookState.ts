import { run } from "@openai/agents";
import { ai_assistant } from "./ai_assistant";

type WaiterState = "SALUTE" | "ASK_ALLERGY" | "ASK_DIET" | "LIST_INGREDIENTS";
type Diet = "OMNIVOROUS" | "VEGETARIAN" | "VEGAN" | "PESCATARIAN";

export interface CookSession {
  id: string;
  cookID: string;
  recipe: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  allergies?: string[];
  diet?: Diet;
}

export default async function switchCookState(
  session: CookSession
): Promise<CookSession> {
  const bot = ai_assistant();
  let response;
  switch (session.step) {
    case "SALUTE":
      session.history.push({
        role: "system",
        content: `Say Hello to our guest, and make a silly comment about the recipe`,
      });
      session.step = "ASK_ALLERGY";
      return session;

    case "ASK_ALLERGY":
      session.history.push({
        role: "system",
        content: `ask if the user has any allregies `,
      });
      session.step = "ASK_DIET";
      return session;
    case "ASK_DIET":
      response = await run(
        bot,
        `extrapolate the possible allergies from this message as "allergies" in an array: ${
          session.history[session.history.length - 1].content
        } `
      );
      if (!response.finalOutput) return session;
      session.allergies = JSON.parse(response.finalOutput).allergies;
      console.log(JSON.parse(response.finalOutput));
      session.history.push({
        role: "system",
        content: `ask if the user has any specific diet `,
      });
      session.step = "LIST_INGREDIENTS";
      return session;
    case "LIST_INGREDIENTS":
      response = await run(
        bot,
        `extrapolate the diet from this message as {"diet":string} : ${
          session.history[session.history.length - 1].content
        } `
      );

      if (!response.finalOutput) return session;
      session.allergies = JSON.parse(response.finalOutput).diet;
      session.history.push({
        role: "system",
        content: `ok now give a wrong recipe `,
      });
      session.step = "SALUTE";
      return session;
  }
}

// Passaggi possibili:

// chiedere se ha allergie o ingredinti che non ti piacciono
// chiedere se mangia carne & pesce o se è vegetariano o vegano
