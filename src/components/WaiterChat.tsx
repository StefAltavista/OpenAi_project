"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import useInitSession from "@/hooks/useInitSession";
import CookChat from "./CookChat";

type Message = { role: string; content: string };

export default function WaiterChat({
  isCook,
}: {
  isCook: (x: boolean) => void;
}) {
  const [userInput, setUserInput] = useState("");
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
  };

  let newHistory: Message[];

  const sendMessage = async () => {
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
    const returnedSession = await res.json();
    setSession(returnedSession);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [session]);

  const selectCook = async (cookID: string) => {
    console.log(session);
    newSession = { ...session, selectedCookId: cookID };
    const returnedSession = await sessionStep(newSession);
    setSession(returnedSession);
    isCook(cookID);
  };
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
        {session &&
          session.proposedCooks &&
          session.proposedCooks.map((x, i) => (
            <div
              onClick={() => selectCook(x.id)}
              key={i}
              className="cursor-pointer p-2 m-2 bg-red-200"
            >
              <p>{x.name}</p>
            </div>
          ))}
      </div>
      {!session?.proposedCooks && (
        <form
          className={`w-full h-[10%] bg-violet-100 rounded w-[80%] flex justify-center items-center`}
        >
          <input
            type="text"
            disabled={session?.proposedCooks ? true : false}
            value={userInput}
            onChange={({ target }) => setUserInput(target.value)}
            className="outline-none w-full h-full p-1 mx-2"
            placeholder="type your message here"
          />
          <button
            type="submit"
            disabled={session?.proposedCooks ? true : false}
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className=" bg-violet-200 rounded p-2  h-10"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
