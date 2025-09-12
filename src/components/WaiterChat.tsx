"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import useInitSession from "@/hooks/useInitSession";

export default function WaiterChat({
  setIsCook,
  setCookID,
  setRecipe,
}: {
  setIsCook: (x: boolean) => void;
  setCookID: (x: string) => void;
  setRecipe: (x: string) => void;
}) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  let newSession: Session;

  const initialValue: Session = {
    id: crypto.randomUUID(),
    step: "WELCOME",
    history: [],
  };
  const [session, setSession] = useState<Session>(initialValue);

  const { sessionInit, error, loadingSession } = useInitSession(
    initialValue,
    "api/waiter"
  );

  useEffect(() => {
    setLoading(loadingSession);
    if (sessionInit && !error) {
      setSession(sessionInit);
    }
  }, [sessionInit, error, loadingSession]);

  const sendMessage = async () => {
    const message = {
      role: "user",
      content: userInput,
    };

    if (!session) return;
    newSession = { ...session, history: [...session.history, message] };
    setSession(newSession); //add user comment to session
    setUserInput("");
    setLoading(true);
    newSession = await sessionStep(newSession, "/api/waiter"); //get api response
    setLoading(false);

    setSession(newSession);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
    if (session?.recipe) {
      setRecipe(session.recipe);
    }
  }, [session]);

  const selectCook = async (cookID: string) => {
    setLoading(true);
    newSession = { ...session, selectedCookId: cookID };
    const returnedSession = await sessionStep(newSession, "/api/waiter");
    setSession(returnedSession);
    setIsCook(true);
    setCookID(cookID);
    setLoading(false);
  };
  return (
    <div className=" relative h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      {loading && (
        <div className="left-0 absolute w-full h-full bg-red-200/10 backdrop-blur-[2px] flex justify-center items-center">
          <p className="p-2 bg-blue-200 rounded">...Loading</p>
        </div>
      )}
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
