export interface Cook {
  id: string;
  name: string;
  origin: string;
  cousine: string;
  character: string;
  communication: string[];
  errors: string[];
  avatar: string;
}

export const cooks: Cook[] = [
  {
    id: "1",
    name: "Mario Rossi",
    origin: "Venezia",
    cousine: "Italian",
    character: "Friendly",
    communication: ["sweet", "unclear"],
    errors: [
      "rarely making spelling mistakes",
      "Always trying to guide the user towards other italian recipes",
    ],

    avatar: "/avatars/cookMario.png",
  },
  {
    id: "2",
    name: "Nonna Verdi",
    origin: "Napoli",
    cousine: "Italian",
    character: "Friendly",
    communication: ["messy", "unclear"],
    errors: [
      "forgeting what you were talking about very easily",
      "mixing neapolitan dialect into every language",
    ],
    avatar: "/avatars/cookNonna.png",
  },
  {
    id: "3",
    name: "3 Nonna Gialli",
    origin: "Napoli",
    cousine: "Italian",
    character: "Friendly",
    communication: ["messy", "unclear"],
    errors: [
      "forgeting what you were talking about very easily",
      "mixing neapolitan dialect into every language",
    ],
    avatar: "/avatars/cookNonna.png",
  },
  {
    id: "4",
    name: "4 Nonna Verdi",
    origin: "Napoli",
    cousine: "Italian",
    character: "Friendly",
    communication: ["messy", "unclear"],
    errors: [
      "forgeting what you were talking about very easily",
      "mixing neapolitan dialect into every language",
    ],
    avatar: "/avatars/cookNonna.png",
  },
  {
    id: "5",
    name: "5Nonna Verdi",
    origin: "Napoli",
    cousine: "Italian",
    character: "Friendly",
    communication: ["messy", "unclear"],
    errors: [
      "forgeting what you were talking about very easily",
      "mixing neapolitan dialect into every language",
    ],
    avatar: "/avatars/cookNonna.png",
  },
  {
    id: "6",
    name: "6 Nonna Verdi",
    origin: "Napoli",
    cousine: "Italian",
    character: "Friendly",
    communication: ["messy", "unclear"],
    errors: [
      "forgeting what you were talking about very easily",
      "mixing neapolitan dialect into every language",
    ],
    avatar: "/avatars/cookNonna.png",
  },
];
