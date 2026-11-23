import React, { useEffect } from "react";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";

interface ImageLightboxProps {
  isOpen: boolean;
  src: string;
  alt: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  src,
  alt,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada da imagem"
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
          aria-label="Fechar visualização"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/40 border border-white/10">
          <img
            src={src}
            alt={alt}
            className="max-h-[75vh] w-auto object-contain select-none transition-transform duration-300"
          />
        </div>

        {alt && (
          <p className="mt-3 text-white/90 text-sm sm:text-base font-medium text-center bg-black/50 px-4 py-2 rounded-full border border-white/10">
            {alt}
          </p>
        )}

        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 p-3 text-white bg-black/60 hover:bg-purple-600 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Foto anterior"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 p-3 text-white bg-black/60 hover:bg-purple-600 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Próxima foto"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};
