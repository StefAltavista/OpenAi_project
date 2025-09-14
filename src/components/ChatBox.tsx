"use client";

import { useEffect, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import useInitSession from "@/hooks/useInitSession";
import InputChatBox from "@/components/InputChatBox";
import ChatHistory from "@/components/ChatHistory";
import { getInitialWaiterValue, sendWaiterMessage } from "@/lib/waiterApiClient";
import { getInitialCookValue, sendCookMessage } from "@/lib/cookApiClient";
import { CookSession } from "@/lib/switchCookState";
import sessionStep from "@/lib/sessionStep";

export default function ChatBox() {
  const [loading, setLoading] = useState(true);
  const [waiterSession, setWaiterSession] = useState<Session>(getInitialWaiterValue());
  const [cookSession, setCookSession] = useState<CookSession>(getInitialCookValue("", ""));
  const [recipe, setRecipe] = useState("");
  const [cookChat, setCookChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessages[]>([]);

  const { sessionInit, error, loadingSession } = useInitSession(
    waiterSession,
    "api/waiter"
  );

  useEffect(() => {
    setLoading(loadingSession);
    if (sessionInit && !error) {
      setWaiterSession(sessionInit);
      addHistoryMessage(sessionInit.history[sessionInit.history.length - 1]);
    }
  }, [sessionInit, error, loadingSession]);

  const addHistoryMessage = (message: ChatHistoryMessages): void => {
    setChatHistory(prev => [...prev, message]);
  }

  const sendMessage = async (input: string) => {
    const userInput = { role: "user", content: input };
    addHistoryMessage(userInput);

    let returnedSession = null

    if (!cookChat) {
      returnedSession = await sendWaiterMessage(input, waiterSession, setWaiterSession);
    } else if (cookChat && cookSession.cookID.trim() !== "") {
      returnedSession = await sendCookMessage(input, cookSession, setCookSession)
    }

    if (returnedSession != null) {
      addHistoryMessage(returnedSession.history[returnedSession.history.length - 1]);
    }

    console.log("DEBUG: sendMessage.returnedSession", returnedSession);
  };

  useEffect(() => {
    if (waiterSession?.recipe) {
      setRecipe(waiterSession.recipe);
    }
  }, [waiterSession]);


  const selectCook = async (cookID: string) => {
    const initialCookSession = getInitialCookValue(cookID, recipe);
    setCookSession(initialCookSession);
    const returnedSession = await sessionStep(initialCookSession, "api/cook");
    console.log("DEBUG: cook Session", returnedSession);
    waiterSession.proposedCooks = undefined; // TODO: proporre i cuochi e avvisare della selezione
    addHistoryMessage(returnedSession.history[returnedSession.history.length - 1]);
    setCookChat(true);
  };

  return (
    <div className=" relative h-[80%] w-[50%] border border-violet-200 m-12 p-6 rounded flex flex-col justify-center ">
      {loading && (
        <div
          className="left-0 absolute w-full h-full bg-red-200/10 backdrop-blur-[2px] flex justify-center items-center">
          <p className="p-2 bg-blue-200 rounded">...Loading</p>
        </div>
      )}

      <ChatHistory
        history={chatHistory ? chatHistory : []}
        proposedCooks={waiterSession?.proposedCooks ? waiterSession.proposedCooks : []}
        selectCookFunc={selectCook}
      />

      {!waiterSession?.proposedCooks && (
        <InputChatBox sendMessage={sendMessage}/>
      )}
    </div>
  );
}

export interface ChatHistoryMessages {
  role: string,
  content: string,
}