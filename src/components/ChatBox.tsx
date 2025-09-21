"use client";

import { useEffect, useState } from "react";
import { Session, WaiterState } from "@/lib/switchWaiterState";
import useInitSession from "@/hooks/useInitSession";
import ChatHistory from "@/components/ChatHistory";
import {
  getInitialWaiterValue,
  sendWaiterMessage,
} from "@/lib/waiterApiClient";
import {
  getInitialCookValue,
  initCookSession,
  sendCookMessage,
} from "@/lib/cookApiClient";
import { CookSession } from "@/lib/switchCookState";
import CookSelectionModal from "./CookSelectionModal";
import InputChatBox from "@/components/InputChatBox";

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

  // Modal variables
  const [isCookModalOpen, setIsCookModalOpen] = useState(false);
  const [failText, setFailText] = useState("");

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
        /* addHistoryMessage(
          returnedSession.history[returnedSession.history.length - 1]
        ); */
        setChatHistory(returnedSession.history);
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
        });
      }
    }
  };

  // TODO: Recipe doesn't show nothing on frontend
  useEffect(() => {
    if (waiterSession?.recipe) {
      setRecipe(waiterSession.recipe);
    }
  }, [waiterSession]);

  useEffect(() => {
    if (cookSession.step === "RETURN_TO_WAITER") {
      setCookChat(false);
      setCookSession(getInitialCookValue("", ""));

      (async () => {
        waiterSession.step = "RETURN_TO_WAITER" as WaiterState;
        let returnedSession = null;
        returnedSession = await sendWaiterMessage(
          " ",
          waiterSession,
          setWaiterSession
        );
        if (returnedSession != null) {
          addHistoryMessage(
            returnedSession.history[returnedSession.history.length - 1]
          );
        }
      })();
    }
  }, [cookSession.step, waiterSession]);

  const startCookCommunication = async (cookID: string) => {
    const returnedSession = await initCookSession(
      cookID,
      recipe,
      setCookSession
    );

    setWaiterSession((prev) => ({ ...prev, proposedCooks: undefined }));
    setWaiterSession((prev) => ({
      ...prev,
      usedCooksID: [...(prev.usedCooksID ?? []), { id: cookID }],
    }));

    if (returnedSession && returnedSession.history.length > 0) {
      const lastMessage =
        returnedSession.history[returnedSession.history.length - 1];
      addHistoryMessage({ ...lastMessage, id: cookID });
    }

    setCookChat(true);

    return cookID;
  };

  // If proposedCook exist open Modal
  useEffect(() => {
    if (
      waiterSession?.proposedCooks &&
      waiterSession.proposedCooks.length > 0
    ) {
      const timeout = setTimeout(() => {
        setIsCookModalOpen(true);
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [waiterSession?.proposedCooks]);

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
      <ChatHistory history={chatHistory ? chatHistory : []} />

      <InputChatBox sendMessage={sendMessage} />

      {isCookModalOpen && waiterSession?.proposedCooks && (
        <CookSelectionModal
          isOpen={isCookModalOpen}
          cooks={waiterSession.proposedCooks}
          failText={failText}
          onFail={() => setFailText("You need to select a cook to proceed!!!")}
          onSelect={async (id) => {
            await startCookCommunication(id);
            setIsCookModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export interface ChatHistoryMessages {
  role: string;
  content: string;
  id?: string;
}
