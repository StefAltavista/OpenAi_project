"use client";

import useInitSession from "@/hooks/useInitSession";
import sessionStep from "@/lib/sessionStep";
import { CookSession } from "@/lib/switchCookState";
import { useEffect, useRef, useState } from "react";

export default function CookChat({
  cookID,
  recipe,
}: {
  cookID: string;
  recipe: string;
}) {
  const [userInput, setUserInput] = useState("");
  const [session, setSession] = useState<CookSession | null>(null);
  const [loading, setLoading] = useState<boolean>();
  const chatRef = useRef<HTMLDivElement>(null);

  const initialValue: CookSession = {
    id: crypto.randomUUID(),
    step: "SALUTE",
    history: [],
    cookID,
    recipe,
  };

  const { sessionInit, error, loadingSession } = useInitSession(
    initialValue,
    "api/cook"
  );

  useEffect(() => {
    setLoading(loadingSession);
    if (sessionInit && !error) {
      setSession(sessionInit);
    }
  }, [sessionInit, error, loadingSession]);

  let newSession: CookSession;
  const sendMessage = async () => {
    const message = {
      role: "user",
      content: userInput,
    };

    if (!session) return;
    newSession = { ...session, history: [...session.history, message] };
    setSession(newSession); //add user mesasge to session
    setUserInput("");
    newSession = await sessionStep(newSession, "/api/cook"); //get api response
    setSession(newSession);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [session]);

  return (
    <div className="h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      <div
        ref={chatRef}
        className="w-full flex flex-col h-[90%] overflow-y-auto hide-scrollbar"
      >
        {loading && <div>...Loading</div>}
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
