"use client";

import CookChat from "@/components/CookChat";
import BasicChat from "@/components/WaiterChat";
import { useState } from "react";

export default function Home() {
  const [isCook, setIsCook] = useState<boolean | string>(false);

  return (
    <div className="h-[80vh] w-full">
      {!isCook && <BasicChat isCook={(x) => setIsCook(x)} />}
      {isCook && <CookChat cookID={isCook} />}
    </div>
  );
}
