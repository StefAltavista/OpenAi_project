import { cooks, Cook } from "@/data/cooks";

export default function getRandomCooks(usedCooks: { id: string }[]) {
  const availableCooks: Cook[] = [];

  cooks.forEach((c) => {
    const found = usedCooks.find((u) => u.id == c.id);
    if (!found) availableCooks.push(c);
  });

  return availableCooks.sort(() => 0.5 - Math.random()).slice(0, 3);
}
