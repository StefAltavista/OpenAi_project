"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: string; content: string };

export default function BasicChat() {
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [response, setResponse] = useState<Message | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  let newHistory: Message[];
  const sendMessage = async () => {
    const message = {
      role: "user",
      content: userInput,
    };

    newHistory = [...history, message];
    setHistory(newHistory);
    setUserInput("");
    const res = await fetch("/api/cook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: newHistory, cookID: "1" }),
    });

    const data = await res.json();
    console.log(data);
    setResponse(data[data.length - 1]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });

    if (!response) return;
    console.log(response);
    setHistory([...history, response]);
    setResponse(null);
  }, [response, history]);
  return (
    <div className="h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      <div
        ref={chatRef}
        className="w-full flex flex-col h-[90%] overflow-y-auto hide-scrollbar"
      >
        {history.map((x, idx) =>
          x.role == "system" ? null : (
            <div
              key={idx}
              className={`p-2 m-2 rounded w-[80%] ${
                x.role == "user"
                  ? "!bg-red-100 text-right ml-auto "
                  : " !bg-blue-100 text-left"
              } `}
            >
              <p>{x.content}</p>
            </div>
          )
        )}
      </div>
      <form className="w-full h-[10%] bg-violet-100 rounded w-[80%] flex justify-center items-center">
        <input
          type="text"
          value={userInput}
          onChange={({ target }) => setUserInput(target.value)}
          className="outline-none w-full h-full p-1 mx-2"
          placeholder="type your message here"
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className=" bg-violet-200 rounded p-2  h-10"
        >
          Send
        </button>
      </form>
    </div>
  );
}
