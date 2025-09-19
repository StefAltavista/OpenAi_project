type ChatMessageProps = {
  content: string;
  // role: "user" | "cook" | "waiter" | "system";
  role: string;
};

export default function ChatMessage({ content, role }: ChatMessageProps) {
  if (role === "system") return null;

  const isUser = role === "user";

  switch (isUser) {
    case true:
      return <div
        className="
          p-2
          m-2
          rounded
          w-[80%]
          max-w-xs
          !bg-red-100
          text-right
          ml-auto
        "
      >
        <p>{content}</p>
      </div>
    case false:
      return <div
        className="
          p-2
          m-2
          rounded
          w-[80%]
          max-w-xs
          !bg-blue-100
          text-left
        "
      >
        <p>{content}</p>
      </div>
  }
}