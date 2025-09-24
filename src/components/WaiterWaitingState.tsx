import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Modal from "./Modal";

interface WaiterWaitingProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaiterWaitingState({
  isOpen,
  onClose,
}: WaiterWaitingProps) {
  const [showLoader, setShowLoader] = useState(true);
  //const [audioStarted, setAudioStarted] = useState(false); // nuovo stato
  const waveRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    // Reset state
    setShowLoader(true);

    // Show loader for 8 seconds
    const timer = setTimeout(() => setShowLoader(false), 8000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Inizialize Wavesurfer when loader is finished
  useEffect(() => {
    if (isOpen && !showLoader && waveRef.current) {
      const ws = WaveSurfer.create({
        container: waveRef.current,
        waveColor: "#ffffff",
        progressColor: "#ff0000",
        cursorColor: "#ffffff",
        barWidth: 3,
        barRadius: 2,
        barGap: 1,
        fillParent: true,
        url: "/audio/call-error.wav",
        autoplay: true,
        //muted: true, // inizialmente muto per evitare blocchi autoplay
      });

      wavesurfer.current = ws;
      let unmuteTimeout: NodeJS.Timeout;

      ws.on("ready", () => {
        console.log("✅ Wavesurfer pronto, riproduco audio...");
        ws.play().catch(() => console.warn("Autoplay bloccato dal browser"));

        unmuteTimeout = setTimeout(() => {
          ws.setMuted(false);
        }, 500);
      });

      ws.on("error", (e) => console.error("Errore Wavesurfer:", e));

      ws.on("finish", () => {
        ws.destroy();
        clearTimeout(unmuteTimeout);
        onClose();
      });
    }
  }, [isOpen, showLoader, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-wrap justify-center gap-8 cook-card-container w-full">
          <div className="cook-avatar">
            <Image
              src="/avatars/waiterAi.png"
              alt="Waiter Ai"
              width={200}
              height={100}
            />
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
              </div> /* : !audioStarted ? (
            <button
              className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
              onClick={() => setAudioStarted(true)}
            >
              Chiama cuoco
            </button>
          )*/
            ) : (
              <div
                ref={waveRef}
                className="w-[300px] h-[100px] gradient-background"
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
