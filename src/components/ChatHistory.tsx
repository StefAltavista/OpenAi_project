import { useEffect, useRef } from "react";
import { Cook } from "@/data/cooks";
import { ChatHistoryMessages } from "@/components/ChatBox";
import ChatMessage from "@/components/ChatMessage";
import { CookSession } from "@/lib/switchCookState";

type ChatHistoryProps = {
  history: ChatHistoryMessages[];
  proposedCooks?: Cook[];
  selectCookFunc?: (cookId: string) => Promise<string>;
  cookStep?: CookSession["step"];
  onReturnToWaiter?: () => void; // TODO: to think how to implement return to waiter
};

export default function ChatHistory(chatHistoryProps: ChatHistoryProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("DEBUG: chatHistory useEffect", chatHistoryProps.history);

    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistoryProps.history]);

  return (
    <div
      ref={chatRef}
      className="w-full flex flex-col h-[90%] overflow-y-auto hide-scrollbar"
    >
      {chatHistoryProps.history.map((x, idx) => (
        <ChatMessage
          key={idx}
          content={x.content}
          role={x.role}
          id={x.id}
          step={x.cookStep}
        />
      ))}
    </div>
  );
}
