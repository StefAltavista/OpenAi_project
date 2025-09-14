"use client";

import CookChat from "@/components/CookChat";
import Report from "@/components/Report";
import ChatBox from "@/components/ChatBox";
import { useEffect, useState } from "react";

export default function Home() {
  const [isCook, setIsCook] = useState(false);
  const [cookID, setCookID] = useState("");
  const [recipe, setRecipe] = useState("");
  const [allergies, setAllergies] = useState<string[] | null>(null);
  const [diet, setDiet] = useState<string[] | null>(null);
  const [ingredients, setIngredients] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isCook) {
      setRecipe("");
      setAllergies(null);
      setDiet(null);
      setIngredients(null);
    }
  }, [isCook]);
  return (
    <div className="h-[80vh] w-full flex ">
      {!isCook && (
        <ChatBox/>
      )}
      {isCook && (
        <CookChat
          cookID={cookID}
          recipe={recipe}
          setAllergies={(x) => setAllergies(x)}
          setDiet={(x) => setDiet(x)}
          setIngredients={(x) => setIngredients(x)}
          close={() => {
            setIsCook(false);
          }}
        />
      )}
      <Report
        recipe={recipe}
        diet={diet}
        allergies={allergies}
        ingredients={ingredients}
      />
    </div>
  );
}
