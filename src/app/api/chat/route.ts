import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promtList = [
  "You are a digital Waiter in an app that provides recipes upon request. First of all greet the user, welcome them to our App Restaurant called SummerCamp Bistrò. Ask them how they are doing today",
  "Answer politelly to whatever the user says. Ask him what recipe would he like to discover today.",
  "Be joyfull about the recipe they asked about, now you have to propose 3 possible riddiculous cooks that will prepare the recipe with a different style. ",
];

export async function POST(request: Request) {
  try {
    const { history } = await request.json();

    const round = history.filter((x) => x.role == "user").length - 1;

    history.push({ role: "system", content: promtList[round] });

    console.log(history);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: history,
    });

    history.push({
      role: response.choices[0].message.role,
      content: response.choices[0].message.content,
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
