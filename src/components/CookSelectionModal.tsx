import Modal from "./Modal";
import Image from "next/image";
import { Cook } from "@/data/cooks";

interface CookSelectionModalProps {
  isOpen: boolean;
  cooks: Cook[];
  failText?: string;
  onClose?: () => void;
  onFail: () => void;
  onSelect: (cookId: string) => Promise<void> | void;
}

export default function CookSelectionModal({
  isOpen,
  cooks,
  failText,
  onClose,
  onFail,
  onSelect,
}: CookSelectionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} onFail={onFail}>
      <div className="flex flex-col items-center text-center p-6">
        <h2 className="text-xl font-bold mb-2">
          These are the chefs available at the moment...
        </h2>
        <p className="text-red-500 font-semibold mb-6">
          Which chef would you like to get in touch with?
        </p>

        <div className="flex justify-center gap-8 flex-wrap">
          {cooks.map((cook, i) => (
            <div
              key={i}
              className="group flex flex-col items-center cursor-pointer hover:scale-105 transition-all"
              onClick={() => onSelect(cook.id)}
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

        {failText && (
          <div className="visible">
            <h1 className="p-3 text-xl text-red-700">
              &#x1F90C; {failText} &#x1F90C;
            </h1>
          </div>
        )}
      </div>
    </Modal>
  );
}
