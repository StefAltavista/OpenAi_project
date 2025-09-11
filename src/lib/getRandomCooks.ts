import { cooks, Cook } from "@/data/cooks";

export default function getRandomCooks(used: string) {
  const available: Cook[] = [];
  cooks.forEach((c) => (c.id != used ? available.push(c) : null));

  return available.sort(() => 0.5 - Math.random()).slice(0, 3);
}
