import { useEffect, useRef } from "react";
import { ChatHistoryMessages } from "@/components/ChatBox";
import ChatMessage from "@/components/ChatMessage";

type ChatHistoryProps = {
  history: ChatHistoryMessages[];
};

export default function ChatHistory({ history }: ChatHistoryProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("DEBUG: chatHistory useEffect", history);

    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  return (
    <div
      ref={chatRef}
      className="w-full flex flex-col h-[90%] overflow-y-auto hide-scrollbar"
    >
      {history.map((x, idx) => (
        <ChatMessage key={idx} content={x.content} role={x.role} id={x.id} />
      ))}
    </div>
  );
}
