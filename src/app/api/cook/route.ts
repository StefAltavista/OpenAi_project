import createAgent from "@/lib/createAgent";
import { NextResponse } from "next/server";
import { run } from "@openai/agents";
import switchCookState, { CookSession } from "@/lib/switchCookState";

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

    if (!result.finalOutput) return;
    newSession.history.push({
      role: "assistant",
      content: result.finalOutput,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 }
    );
  }
}
