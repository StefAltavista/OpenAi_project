interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onFail?: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onFail, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onFail}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onFail}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold transition-colors duration-200 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
