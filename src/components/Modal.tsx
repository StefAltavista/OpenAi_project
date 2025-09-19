interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onFail: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onFail, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onFail}
    >
      <div
        className="relative bg-gray-100 rounded-2xl shadow-xl p-6 
                   w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onFail}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
