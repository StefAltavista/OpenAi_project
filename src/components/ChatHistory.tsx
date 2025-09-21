import { ChatHistoryMessages } from "@/components/ChatBox";
import ChatMessage from "@/components/ChatMessage";

type ChatHistoryProps = {
  history: ChatHistoryMessages[];
};

export default function ChatHistory({ history }: ChatHistoryProps) {
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {history.map((x, idx) => (
        <ChatMessage key={idx} content={x.content} role={x.role} id={x.id} />
      ))}
    </div>
  );
}
