import createAgent from "@/lib/createAgent";
import { NextResponse } from "next/server";
import { run } from "@openai/agents";

export async function POST(request: Request) {
  const { history, cookID } = await request.json();
  let cookAgent;

  try {
    cookAgent = createAgent(cookID);
  } catch {
    return NextResponse.json({ error: "Error creating cook" }, { status: 500 });
  }

  try {
    const result = await run(
      cookAgent,
      history
        .map(
          (m: { role: string; content: string }) => `${m.role}: ${m.content}`
        )
        .join("\n")
    );

    history.push({
      role: "assistant",
      content: result.finalOutput,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 }
    );
  }
}
