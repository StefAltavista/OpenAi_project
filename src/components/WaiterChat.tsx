"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import sessionStep from "@/lib/sessionStep";
import useInitSession from "@/hooks/useInitSession";
import Modal from "./Modal";
import Image from "next/image";

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

  // Select cook from modal
  const selectCook = async (cookID: string) => {
    setLoading(true);
    newSession = { ...session, selectedCookId: cookID };
    const returnedSession = await sessionStep(newSession, "/api/waiter");
    setSession(returnedSession);
    setIsCook(true);
    setCookID(cookID);
    setLoading(false);
    setIsModalOpen(false); // Close modal after selecting a cook
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (session?.proposedCooks) {
      setIsModalOpen(true);
    }
  }, [session?.proposedCooks]);

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
        {session && session.proposedCooks && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
            }}
          >
            <div className="flex flex-col items-center text-center p-6">
              <h2 className="text-xl font-bold mb-2">
                These are the chefs available at the moment...
              </h2>
              <p className="text-red-500 font-semibold mb-6">
                Which chef would you like to get in touch with?
              </p>

              <div className="flex justify-center gap-8">
                {session.proposedCooks?.map((cook, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center cursor-pointer  hover:scale-105  transition-all"
                    onClick={() => selectCook(cook.id)}
                  >
                    <div className="w-32 h-32 rounded-full flex items-center justify-center mb-3 group-hover:shadow-lg">
                      <Image
                        src={cook.avatar}
                        alt={cook.name}
                        width={128}
                        height={128}
                        className="rounded-full"
                      />
                    </div>
                    <p className="px-4 py-1 border-2 border-red-400 text-red-500 rounded-full font-medium group-hover:shadow-lg group-hover:text-red-700">
                      {cook.name}
                    </p>
                    <div className="text-sm text-gray-500 mt-2 group-hover:visible invisible">
                      <p>Origin: {cook.origin}</p>
                      <p>Cuisine: {cook.cousine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
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
