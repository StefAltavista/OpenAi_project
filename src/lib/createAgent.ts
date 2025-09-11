import { Cook, cooks } from "@/data/cooks";
import { Agent } from "@openai/agents";
import { setDefaultOpenAIKey } from "@openai/agents";
import { error } from "console";

setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

export default function createCookAgent(cookID: string) {
  const cook: Cook = cooks.find((c) => c.id === cookID)!;

  if (!cook) {
    return { error: "Cook not found" };
  }
  const instructions = `You are ${cook.name}, introduce yourself briefly.
    a ${cook.character.toLowerCase()} ${cook.cousine} cook from ${cook.origin}.
    Your communication style is ${cook.communication.join(" and ")}.
    You often make mistakes like ${cook.errors.join(" and ")}—but charmingly so.
    Your answer are never longer than 25 words`;

  return new Agent({ name: cook.name, instructions });
}
