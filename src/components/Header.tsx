import React from "react";
import { useCart } from "../context/CartContext.tsx";
import { MapPinIcon } from "./Icons.tsx";

interface HeaderProps {
  onSelectCategory: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCategory,
}) => {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFE]/95 backdrop-blur-md border-b border-[#DDD6FE]/70 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4 gap-3 sm:gap-6">
          {/* Logo & Calligraphic Tagline */}
          <a
            href="#"
            className="flex items-center space-x-3 group flex-shrink-0"
            aria-label="Cantinho Doce - Início"
          >
            <div className="relative">
              <img
                src="/images/logo-jana01.png"
                alt="Logo Cantinho Doce"
                className="w-12 h-12 rounded-full p-1 bg-white shadow-md border-2 border-[#8B5CF6]/30 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-script text-[#1C1C2E] block leading-tight font-bold tracking-wide">
                Cantinho Doce
              </span>
              <span className="text-[11px] sm:text-xs text-[#8B5CF6] font-medium tracking-normal block -mt-1 italic">
                Onde cada fatia é uma celebração!
              </span>
            </div>
          </a>

          {/* Delivery Location Pill (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-[#DDD6FE] text-xs text-[#1C1C2E] shadow-2xs">
            <MapPinIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span className="font-semibold text-[#1C1C2E]">Cidade Jardim Itatiaia</span>
            <span className="text-[#7C6FAD]">| Encomendas & Retirada</span>
          </div>

          {/* Quick Actions & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Christmas Shortcut button */}
            <button
              onClick={() => onSelectCategory("natal-anonovo")}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-xs font-bold text-[#5B21B6] bg-[#EDE9FE] hover:bg-[#DDD6FE] transition-colors border border-[#C4B5FD] shadow-2xs"
            >
              🎄 Especial de Natal
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-[#1C1C2E] hover:bg-[#2D2B55] text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
              aria-label={`Ver carrinho com ${totalItems} itens`}
            >
              <span className="text-base">🛍️</span>
              <span className="hidden sm:inline text-xs font-bold">Meu Pedido</span>
              {totalItems > 0 && (
                <span className="bg-[#8B5CF6] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full animate-bounce shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
