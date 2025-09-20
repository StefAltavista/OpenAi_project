import { cooks } from "@/data/cooks";
import Image from "next/image";

type ChatMessageProps = {
  content: string;
  role: string;
  id?: string;
  onShowCookModal?: () => void;
};

// Receive detail of interaction from user to Waiter or from user to Cook
export default function ChatMessage({ content, role, id }: ChatMessageProps) {
  if (role === "system") return null;

  let avatarSrc = "";
  let altText = "";
  let messageBg = "";
  let alignClass = "";

  // Branch user
  if (role === "user") {
    avatarSrc = "/avatars/user.png";
    altText = "user";
    messageBg = "bg-red-100 text-right ml-auto";
    alignClass = "flex-row-reverse";
    // Branch Cook
  } else if (role === "cook" && id) {
    const selectedCook = cooks.find((cook) => cook.id === id);
    if (!selectedCook) return null;
    avatarSrc = selectedCook.avatar;
    altText = selectedCook.name;
    messageBg = "bg-green-100 text-left";
  } else {
    // Branch waiter
    avatarSrc = "/avatars/waiterAi.png";
    altText = "waiter";
    messageBg = "bg-blue-100 text-left";
  }

  return (
    <div className={`flex items-start gap-2 mb-2 ${alignClass}`}>
      <Image
        src={avatarSrc}
        alt={altText}
        width={50}
        height={50}
        className="rounded-full"
      />
      <div className={`p-2 m-2 rounded w-[80%] max-w-xs ${messageBg}`}>
        <p>{content}</p>
      </div>
    </div>
  );
}
