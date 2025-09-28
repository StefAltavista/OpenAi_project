# Interaction with OpenAI

This documentation describes how the application interacts with OpenAI through three agents:

- **Waiter Agent** → general conversational assistant, ironic and deliberately unhelpful.
- **Cook Agent** → guides recipe preparation with confusing responses and deliberately wrong ingredients.
- **AI Assistant (JSON Creator)** → technical agent that returns only structured JSON outputs, used to extract information from Cook's responses.

---

## 🔄 General Flow Diagram

[User] -> [Frontend React] -> Waiter Agent / Cook Agent -> AI Assistant -> Updated session

---

## 🍽️ Waiter Agent – `POST /api/waiter`

### Overview

Manages general user conversation in a **ironic and deliberately unhelpful** tone, updating the session state step-by-step via `switchWaiterState`.

### Main Steps and Prompts

| Step             | Prompt / Instructions                                                                                  | Expected Behavior                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| WELCOME          | "You are a digital Waiter in an app that provides recipes upon request. Greet and welcome the user..." | Short greeting (<20 words), ironic tone      |
| ASK_RECIPE       | "Answer politely to whatever the user says. Ask what recipe they want."                                | Invite user to choose a recipe, playful tone |
| PROPOSE_COOK     | "Extrapolate the name of the recipe from this message..."                                              | Identify recipe, propose random cooks        |
| COOK_SELECTED    | "Give a weird feedback about the user's choice..."                                                     | Ironic/absurd comment, handoff to Cook       |
| RETURN_TO_WAITER | "Apologize to the user and offer new cooks..."                                                         | Ironic tone, new selection of cooks          |

### Example Conversation

**User:** "I want advice for dinner."  
**Waiter:** "Dinner? Wasn't it breakfast time? I'd eat cookies and see how it goes."

---

## 👨‍🍳 Cook Agent – `POST /api/cook`

### Overview

Guides the user through the recipe in a deliberately **confusing and ironic** way, also producing ingredient lists that are often wrong.  
For creation of this agent we followed the guidelines of OpenAi documentation: Agents SDK TypeScript -> https://openai.github.io/openai-agents-js/

### Main Steps and Prompts

| Step             | Prompt / Instructions                                                      | Expected Behavior                         |
| ---------------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| SALUTE           | "Say Hello, make a silly comment about the recipe, ask if user has a diet" | Ironic greeting and joke about the recipe |
| ASK_ALLERGY      | "Extrapolate diet info from the user message"                              | Store any diet information                |
| RANDOM_QUESTION  | "Extrapolate allergies and ask a random question"                          | Absurd question, playful tone             |
| LIST_INGREDIENTS | "Now give a wrong recipe with random scales, maybe wrong allergens"        | Deliberately wrong ingredients, confusing |
| END              | "Say goodbye and handoff to the waiter"                                    | Ends session with ironic tone             |
| RETURN_TO_WAITER | "The cook session has ended. Returning to the waiter..."                   | Session ended, handoff to Waiter          |

### Code extract

/lib/switchCookState.ts

```typescript
import { run } from "@openai/agents"; // call function run from openai libraries
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

...

```

### Example Conversation

**User:** "How do I make carbonara?"  
**Cook:** "First throw chocolate into the spaghetti… oh and add a pinch of sugared pepper!"

---

## 🤖 AI Assistant – `lib/ai_assistant.ts`

### Overview

Technical agent that returns **only JSON**.  
Mainly used by the Cook Agent to extract structured data (ingredients, messages).

### Example Output

Input:

```txt
Extrapolate ingredients in JSON from: "Great! For a carbonara you need spaghetti, guanciale, eggs, and pecorino."
```

Output:

```json
{
  "message": "Great! For a carbonara you need...",
  "ingredients": ["spaghetti", "guanciale", "eggs", "pecorino"]
}
```

## 🔧 General Notes

The application is deliberately ironic and unhelpful.

Agents’ prompts are designed to produce funny, unpredictable, and confusing responses.

All steps update the session (history and step) to maintain flow consistency.
