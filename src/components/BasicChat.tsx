"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "@/lib/switchWaiterSession";
import sessionStep from "@/lib/sessionStep";
import useInitSession from "@/hooks/useInitSession";

type Message = { role: string; content: string };

export default function BasicChat() {
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<Message[]>();
  const [session, setSession] = useState<Session>();
  const chatRef = useRef<HTMLDivElement>(null);

  let newSession: Session;

  const { sessionInit, error, loadingSession } = useInitSession();

  useEffect(() => {
    if (sessionInit && !error) {
      setSession(sessionInit);
    }
  }, [sessionInit]);

  const step = async () => {
    if (!session) return;
    newSession = await sessionStep(session);
    setSession(newSession);
    setHistory(newSession.history);
  };

  let newHistory: Message[];

  const sendMessage = async () => {
    console.log("send");
    const message = {
      role: "user",
      content: userInput,
    };

    if (!session) return;
    newSession = { ...session, history: [...session.history, message] };

    setSession(newSession);
    setUserInput("");
    const res = await fetch("/api/waiter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: newSession }),
    });
    const data = await res.json();
    console.log(data);
    setSession(data);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });

    // if (!response) return;
    // console.log(response);
    // newSession=
    // setHistory([...history, response]);
    // setResponse(null);
  }, [session]);

  return (
    <div className="h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      <div
        ref={chatRef}
        className="w-full flex flex-col h-[90%] overflow-y-auto hide-scrollbar"
      >
        {session &&
          session.history.map((x, idx) =>
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
