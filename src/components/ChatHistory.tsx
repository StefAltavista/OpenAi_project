import { useEffect, useRef } from "react";
import { Cook } from "@/data/cooks";
import { ChatHistoryMessages } from "@/components/ChatBox";

type ChatHistoryProps = {
  history: ChatHistoryMessages[],
  proposedCooks: Cook[];
  selectCookFunc: (cookId: string) => void;
}

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
      {
        chatHistoryProps.history.map((x, idx) =>
          x.role == "system" ? null : (
            <div
              key={idx}
              className={`p-2 m-2 rounded w-[80%] ${
                x.role == "user"
                  ? "!bg-red-100 text-right ml-auto "
                  : " !bg-blue-100 text-left"
              }`}
            >
              <p>{x.content}</p>
            </div>
          )
        )
      }
      {
        chatHistoryProps.proposedCooks.map((x, i) => (
          <div
            onClick={() => chatHistoryProps.selectCookFunc(x.id)}
            key={i}
            className="cursor-pointer p-2 m-2 bg-red-200"
          >
            <p>{x.name}</p>
          </div>
        ))}
    </div>
  );
}