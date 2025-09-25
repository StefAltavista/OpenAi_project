"use client";

import { useEffect, useState, useRef } from "react";
import { Session, WaiterState } from "@/lib/switchWaiterState";
import useInitSession from "@/hooks/useInitSession";
import ChatHistory from "@/components/ChatHistory";
import { getInitialWaiterValue, sendWaiterMessage, } from "@/lib/waiterApiClient";
import { getInitialCookValue, initCookSession, sendCookMessage } from "@/lib/cookApiClient";
import { CookSession } from "@/lib/switchCookState";
import Modal from "./Modal";
import Image from "next/image";
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

  // Single scroll ref for the actual scrollable container
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sessionInit && !error) {
      setWaiterSession(sessionInit);
      addHistoryMessage(sessionInit.history[sessionInit.history.length - 1]);
    }
  }, [sessionInit, error]);

  const addHistoryMessage = (message: ChatHistoryMessages): void => {
    setChatHistory((prev) => [...prev, message]);
  };

  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
  }, [chatHistory]);

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

  useEffect(() => {
    if (waiterSession?.recipe) {
      setRecipe(waiterSession.recipe);
    }
  }, [waiterSession]);

  useEffect(() => {
    if (cookSession.step === 'RETURN_TO_WAITER') {
      setCookChat(false);
      setCookSession(getInitialCookValue("", ""));

      (async () => {
        waiterSession.step = "RETURN_TO_WAITER" as WaiterState;
        let returnedSession = null;
        returnedSession = await sendWaiterMessage(" ", waiterSession, setWaiterSession);
        if (returnedSession != null) {
          addHistoryMessage(returnedSession.history[returnedSession.history.length - 1]);
        }
      })();
    }
  }, [cookSession.step]);

  const startCookCommunication = async (cookID: string) => {
    const returnedSession = await initCookSession(cookID, recipe, setCookSession);

    setWaiterSession((prev) => ({ ...prev, proposedCooks: undefined }));
    setWaiterSession((prev) => ({ ...prev, usedCooksID: [...(prev.usedCooksID ?? []), { id: cookID }], }));

    if (returnedSession && returnedSession.history.length > 0) {
      const lastMessage =
        returnedSession.history[returnedSession.history.length - 1];
      addHistoryMessage({ ...lastMessage, id: cookID });
    }

    setCookChat(true);

    return cookID;
  };

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
    <div className="chat-container relative w-full max-w-5xl flex flex-col h-full p-6">
      <div className="flex-1 min-h-0 flex flex-col">
        <div 
          ref={scrollRef}
          className="chat-scroll hide-scrollbar"
        >
          <ChatHistory history={chatHistory ?? []} />
        </div>
        <div className="sticky bottom-0 pt-3 bg-transparent">
          <InputChatBox sendMessage={sendMessage} />
        </div>
      </div>

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
          <div className="modal-box flex flex-col items-center text-center p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              These are the chefs available at the moment...
            </h2>
            <p className="text-red-600 font-semibold mb-8 text-lg">
              Which chef would you like to get in touch with?
            </p>

            <div className="flex flex-wrap justify-center gap-8 cook-card-container w-full">
              {waiterSession?.proposedCooks &&
                waiterSession.proposedCooks.map((cook, i) => (
                  <div
                    key={i}
                    className="cook-card"
                    onClick={async () => {
                      const id = await startCookCommunication(cook.id);
                      console.log("Hai selezionato:", id);
                      setIsCookModalOpen(false);
                    }}
                  >
                    <div className="cook-avatar mb-4">
                      <Image
                        src={cook.avatar}
                        alt={cook.name}
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="cook-name mb-3">
                      {cook.name}
                    </p>
                    <div className="cook-details">
                      <div className="cook-detail-item">
                        <span className="cook-detail-label">Origin:</span> {cook.origin}
                      </div>
                      <div className="cook-detail-item">
                        <span className="cook-detail-label">Cuisine:</span> {cook.cousine}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {failText !== "" && (
              <div className="fail-message mt-6">
                🤌 {failText} 🤌
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export interface ChatHistoryMessages {
  role: string;
  content: string;
  id?: string;
}