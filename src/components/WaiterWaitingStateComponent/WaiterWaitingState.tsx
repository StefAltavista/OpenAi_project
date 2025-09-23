"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import "./WaiterWaitingState.css";
import Modal from "../Modal";



export default function WaiterWaitingState({isOpen: boolean}) {
  const [showLoader, setShowLoader] = useState(true);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  // Timer solo per mostrare il loader
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Inizializza Wavesurfer quando il loader sparisce e il div è montato
  useEffect(() => {
  if (!showLoader && waveRef.current) {
    const ws = WaveSurfer.create({
      container: waveRef.current,
      waveColor: "#f66c76",
      progressColor: "#d66fa3",
      cursorColor: "#FF6B6B",
      barWidth: 3,
      barRadius: 2,
      barGap: 1,
      height: 100,
      url: "/audio/call-error.wav",
    });

    wavesurfer.current = ws;

    let unmuteTimeout: NodeJS.Timeout;

    ws.on("ready", () => {
      console.log("Wavesurfer pronto, riproduco audio...");

      ws.setMuted(true);
      ws.play().catch(() => console.warn("Autoplay bloccato dal browser"));

      unmuteTimeout = setTimeout(() => {
        ws.setMuted(false);
      }, 250);
    });

    ws.on("error", (e) => console.error("Errore Wavesurfer:", e));

    return () => {
      ws.destroy(); // pulisce Wavesurfer
      clearTimeout(unmuteTimeout); // pulisce il setTimeout
    };
  }
}, [showLoader]);



  return (
    <>

      <Modal isOpen={{isOpen}}>

      <div className="flex flex-wrap justify-center gap-8 cook-card-container w-full">
        <div className="cook-avatar">
          <Image
            src="/avatars/waiterAi.png"
            alt="Waiter Ai"
            width={200}
            height={100}
          />
        </div>
      </div>

      <div className="flex flex-col items-center text-center p-8">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Please, stay on the line!!!
        </h2>
        <p className="text-red-600 font-semibold mb-8 text-lg">
          I’ll get in touch with the chef you chose...
        </p>

        {showLoader ? (
          <div className="loadership_GRTSL">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
        
          <div ref={waveRef} className="w-[300px] h-[100px]" />
    
        )}
      </div>

      </Modal>
   
    </>
  );
}
