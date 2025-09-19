import createAgent from "@/lib/createAgent";
import { NextResponse } from "next/server";
import { run } from "@openai/agents";
import switchCookState, { CookSession } from "@/lib/switchCookState";
import { ai_assistant } from "@/lib/ai_assistant";

export async function POST(request: Request) {
  const { session } = await request.json();
  let cookAgent;

  try {
    cookAgent = createAgent(session.cookID, session.recipe);
  } catch {
    return NextResponse.json({ error: "Error creating cook" }, { status: 500 });
  }

  const newSession: CookSession = await switchCookState(session);

  try {
    const result = await run(
      cookAgent,
      newSession.history
        .map(
          (m: { role: string; content: string }) => `${m.role}: ${m.content}`
        )
        .join("\n")
    );

    if (session.step == "END") {
      const bot = ai_assistant();
      const getIngredientsList = await run(
        bot,
        `from the following message extrapolate the ingredients list in JSON format and put the message (without list) in a separate field "message" : ${result.finalOutput}`
      );
      if (getIngredientsList.finalOutput) {
        newSession.history.push({
          role: "cook",
          content: JSON.parse(getIngredientsList.finalOutput).message,
        });
        newSession.ingredients = JSON.parse(
          getIngredientsList.finalOutput
        ).ingredients;
        return NextResponse.json(newSession);
      }
    } else if (!result.finalOutput) return;
    else
      newSession.history.push({
        role: "cook",
        content: result.finalOutput,
      });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 }
    );
  }
}
