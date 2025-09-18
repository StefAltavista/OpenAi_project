"use client";

import { useEffect, useState } from "react";
import { Session } from "@/lib/switchWaiterState";
import useInitSession from "@/hooks/useInitSession";
import InputChatBox from "@/components/InputChatBox";
import ChatHistory from "@/components/ChatHistory";
import {
  getInitialWaiterValue,
  sendWaiterMessage,
} from "@/lib/waiterApiClient";
import { getInitialCookValue, sendCookMessage } from "@/lib/cookApiClient";
import { CookSession } from "@/lib/switchCookState";
import sessionStep from "@/lib/sessionStep";

// Unifed chatbox with interaction user -> waiter and then user -> chef selected
export default function ChatBox() {
  const [waiterSession, setWaiterSession] = useState<Session>(
    getInitialWaiterValue()
  );
  const [cookSession, setCookSession] = useState<CookSession>(
    getInitialCookValue("", "")
  );
  const [recipe, setRecipe] = useState("");
  const [cookChat, setCookChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessages[]>([]);

  const { sessionInit, error } = useInitSession(waiterSession, "api/waiter");

  useEffect(() => {
    if (sessionInit && !error) {
      setWaiterSession(sessionInit);
      addHistoryMessage(sessionInit.history[sessionInit.history.length - 1]);
    }
  }, [sessionInit, error]);

  const addHistoryMessage = (message: ChatHistoryMessages): void => {
    setChatHistory((prev) => [...prev, message]);
  };

  const sendMessage = async (input: string) => {
    const userInput = { role: "user", content: input };
    addHistoryMessage(userInput);

    let returnedSession = null;

    if (!cookChat) {
      returnedSession = await sendWaiterMessage(
        input,
        waiterSession,
        setWaiterSession
      );
      if (returnedSession != null) {
        addHistoryMessage(
          returnedSession.history[returnedSession.history.length - 1]
        );
      }
    } else if (cookChat && cookSession.cookID.trim() !== "") {
      returnedSession = await sendCookMessage(
        input,
        cookSession,
        setCookSession
      );
      if (returnedSession != null) {
        addHistoryMessage({
          ...returnedSession.history[returnedSession.history.length - 1],
          id: cookSession.cookID,
          cookStep: cookSession.step,
        });
      }

      if (cookSession.step === "RETURN_TO_WAITER") {
        setCookChat(false);
      }
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

    setWaiterSession((prev) => ({ ...prev, proposedCooks: undefined }));

    if (returnedSession && returnedSession.history.length > 0) {
      const lastMessage =
        returnedSession.history[returnedSession.history.length - 1];
      addHistoryMessage({
        ...lastMessage,
        id: cookID,
      });
    }

    setCookChat(true);

    return cookID;
  };

  //const backToWaiter = async () => {};

  return (
    <div
      className="
        relative h-[90dvh]
        lg:w-5/6
        mx-auto
        border
        border-violet-200
        p-6 rounded
        flex
        flex-col
        justify-center
      "
    >
      {!cookChat && (
        <>
          <ChatHistory
            history={chatHistory ? chatHistory : []}
            proposedCooks={
              waiterSession?.proposedCooks ? waiterSession.proposedCooks : []
            }
            selectCookFunc={selectCook}
          />
        </>
      )}

      {isCookModalOpen && (
        <Modal
          isOpen={isCookModalOpen}
          onClose={() => {
            setIsCookModalOpen(false);
          }}
          onFail={() => {
            setFailText("You need to select a cook to proceed!!!");
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
              {waiterSession?.proposedCooks &&
                waiterSession.proposedCooks.map((cook, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center cursor-pointer  hover:scale-105  transition-all"
                    onClick={async () => {
                      const id = await selectCook(cook.id);
                      console.log("Hai selezionato:", id);
                      setIsCookModalOpen(false);
                    }}
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
            {/* Show fail text if user tries to close modal without selecting a cook */}
            {failText != "" && (
              <div className=" visible">
                <h1 className="p-3 text-xl text-red-700">
                  &#x1F90C; {failText} &#x1F90C;
                </h1>
              </div>
            )}
          </div>
        </Modal>
      )}

      {cookChat && (
        <>
          <ChatHistory history={chatHistory ? chatHistory : []} />
        </>
      )}

      {!waiterSession?.proposedCooks && (
        <InputChatBox sendMessage={sendMessage} />
      )}
    </div>
  );
}

export interface ChatHistoryMessages {
  role: string;
  content: string;
  id?: string;
  cookStep?: CookSession["step"];
}
