export interface Cook {
  id: string;
  name: string;
  cousine: string;
  tone: string;
  communication: string[];
  errors: string[];
  avatar: string;
}

export const cooks: Cook[] = [
  {
    id: "1",
    name: "Mario Rossi",
    cousine: "Italian",
    tone: "Friendly",
    communication: ["messy", "unclear"],
    errors: ["spelling", "grammar"],
    avatar: "/avatars/coockMario.png",
  },
];
