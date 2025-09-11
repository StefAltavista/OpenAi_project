import createAgent from "@/lib/createAgent";
import { NextResponse } from "next/server";
import { run } from "@openai/agents";

export async function POST(request: Request) {
  const { history, cookID } = await request.json();
  // implenet session

  let cookAgent;

  // Passaggi possibili:

  // chiedere se ha allergie o ingredinti che non ti piacciono
  // chiedere se mangia carne & pesce o se è vegetariano o vegano

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

    // "role: assistant", content: result.finalOutput\nrole:user, content: "ok, perfetto, grazie"

    // session.history.push
    history.push({
      role: "assistant",
      content: result.finalOutput,
    });

    // return NextResponse.json(session);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Error generating AI response" },
      { status: 500 }
    );
  }
}
