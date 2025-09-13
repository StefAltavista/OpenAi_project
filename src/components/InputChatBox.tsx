import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";

type InputChatBoxProps = {
  sendMessage: (input: string) => void,
};

export default function InputChatBox(inputChatBoxProps: InputChatBoxProps) {
  const [userInput, setUserInput] = useState("");

  return (
    <form
      className="
        w-full
        {/*h-[10%]*/}
        bg-white
        rounded-2xl
        w-[80%]
        flex
        flex-col
        {/*justify-center*/}
        {/*items-center*/}
        border-3
        border-red-600"
    >
      <input
        type="text"
        value={userInput}
        onChange={({ target }) => setUserInput(target.value)}
        className="outline-none p-1 m-2 placeholder:truncate"
        placeholder="Enter your message..."
      />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (userInput.trim() !== "") {
            inputChatBoxProps.sendMessage(userInput);
          }
          setUserInput("");
        }}
        className="bg-red-400/50 rounded p-2 m-2 h-10 self-end"
      >
        <FaTelegramPlane size={20}/>
      </button>
    </form>
  )
}