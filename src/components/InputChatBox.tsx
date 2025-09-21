import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

type InputChatBoxProps = {
  sendMessage: (input: string) => void;
  disabled?: boolean;
};

export default function InputChatBox({
  sendMessage,
  disabled = false,
}: InputChatBoxProps) {
  const [userInput, setUserInput] = useState("");

  return (
    <form
      className="
        w-full
        sm:w-4/5
        xl:w-3/5
        mx-auto
        bg-white
        rounded-2xl
        flex
        flex-col
        border-3
        mt-5
        border-red-600"
    >
      <input
        type="text"
        value={userInput}
        onChange={({ target }) => setUserInput(target.value)}
        className="outline-none p-1 m-2 placeholder:truncate disabled:bg-gray-100 disabled:text-gray-400"
        placeholder={disabled ? "⚠️ Wait a minute..." : "Enter your message..."}
        disabled={disabled}
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (userInput.trim() !== "" && !disabled) {
            sendMessage(userInput);
            setUserInput("");
          }
        }}
        className={`rounded p-2 m-2 h-10 self-end flex items-center justify-center
          ${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-400/50 hover:bg-red-400"
          }
        `}
        disabled={disabled}
      >
        <FaTelegramPlane size={20} />
      </button>
    </form>
  );
}
