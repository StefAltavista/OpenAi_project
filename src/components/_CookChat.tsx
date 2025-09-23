/*"use client";

import useInitSession from "@/hooks/useInitSession";
import sessionStep from "@/lib/sessionStep";
import { CookSession } from "@/lib/switchCookState";
import { useEffect, useRef, useState } from "react";
import InputChatBox from "@/components/InputChatBox";

export default function _CookChat({
  cookID,
  recipe,
  setAllergies,
  setDiet,
  setIngredients,
  close,
}: {
  cookID: string;
  recipe: string;
  setAllergies: (x: string[]) => void;
  setDiet: (x: string[]) => void;
  setIngredients: (x: string[]) => void;
  close: () => void;
}) {
  const [session, setSession] = useState<CookSession | null>(null);
  const [loading, setLoading] = useState<boolean>();
  const [end, setEnd] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const initialValue: CookSession = {
    id: crypto.randomUUID(),
    step: "SALUTE",
    history: [],
    cookID,
    recipe,
  };

  const { sessionInit, error } = useInitSession(
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

  const sendMessage = async (input: string) => {

    const message = {
      role: "user",
      content: input,
    };

    if (!session) return;
    newSession = { ...session, history: [...session.history, message] };
    setSession(newSession); //add user mesasge to session
    setLoading(true);
    newSession = await sessionStep(newSession, "/api/cook"); //get api response
    setSession(newSession);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    if (session.allergies) setAllergies(session.allergies);
    if (session.diet) setDiet(session?.diet);
    if (session.ingredients) setIngredients(session.ingredients);
    if (session.step == "END") {
      setEnd(true);
    }
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [session, end]);

  return (
    <div className="relative h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      {loading && (
        <div
          className="left-0 absolute w-full h-full bg-red-200/10 backdrop-blur-[2px] flex justify-center items-center">
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
      </div>
      {end && (
        <div className="my-2 p-2 bg-violet-100 rounded flex flex-col items-center ">
          <h1 className="font-bold my-2">Are you satisfied with the recipe?</h1>
          <div className="flex w-full justify-around">
            <button className="cursor-pointer hover:bg-green-200 bg-violet-200 rounded p-2">
              Yes!
            </button>
            <button
              className="cursor-pointer hover:bg-green-200 bg-violet-200 rounded p-2"
              onClick={() => close()}
            >
              No, Take me back to the waiter
            </button>
          </div>
        </div>
      )}
      <InputChatBox sendMessage={sendMessage}/>
    </div>
  );
}
*/
