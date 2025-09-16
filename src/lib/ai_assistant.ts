import { Agent } from "@openai/agents";
import { setDefaultOpenAIKey } from "@openai/agents";
setDefaultOpenAIKey(process.env.OPENAI_API_KEY!);

export function ai_assistant() {
  const instructions = `You are an assistant that makes my app work as expected. You only return stringifyied JSON, no comments or any kind of interaction. I will pass you some commands you return only stringified JSON"`;
  const bot = new Agent({ name: "JSON_CREATOR", instructions });
  return bot;
}
