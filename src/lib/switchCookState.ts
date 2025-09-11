type WaiterState = "SALUTE" | "ASK_ALLERGY";

export interface Session {
  id: string;
  cookID: string;
  step: WaiterState;
  history: { role: string; content: string }[];
  allergyInfo?: string[];
}
