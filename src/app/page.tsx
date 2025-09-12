"use client";

import CookChat from "@/components/CookChat";
import WaiterChat from "@/components/WaiterChat";
import { useState } from "react";

export default function Home() {
  const [isCook, setIsCook] = useState(false);
  const [cookID, setCookID] = useState("");
  const [recipe, setRecipe] = useState("");

  return (
    <div className="h-[80vh] w-full flex ">
      {!isCook && (
        <WaiterChat
          setIsCook={(x) => setIsCook(x)}
          setCookID={(x) => setCookID(x)}
          setRecipe={(x) => setRecipe(x)}
        />
      )}
      {isCook && <CookChat cookID={cookID} recipe={recipe} />}
      {recipe && (
        <div>
          <h1 className="mt-12 text-[20px] p-2 rounded h-auto bg-blue-100   ">
            Mission: {recipe}
          </h1>
        </div>
      )}
    </div>
  );
}
