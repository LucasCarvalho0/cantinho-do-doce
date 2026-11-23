import React from "react";
import { Product } from "../types.ts";
import { formatCurrency } from "../utils/whatsapp.ts";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  // Pastel accents corresponding to cards in the reference image
  const bgThemes = {
    lavender: {
      cardBg: "bg-white",
      topWave: "bg-[#EDE9FE]/70",
      btnBg: "bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#8B5CF6] hover:text-white",
      border: "border-[#DDD6FE]",
    },
    rose: {
      cardBg: "bg-white",
      topWave: "bg-[#FCE7F3]/70",
      btnBg: "bg-[#FCE7F3] text-[#BE185D] hover:bg-[#EC4899] hover:text-white",
      border: "border-[#FBCFE8]",
    },
    cream: {
      cardBg: "bg-white",
      topWave: "bg-[#FEF3C7]/70",
      btnBg: "bg-[#FEF3C7] text-[#B45309] hover:bg-[#F59E0B] hover:text-white",
      border: "border-[#FDE68A]",
    },
    blue: {
      cardBg: "bg-white",
      topWave: "bg-[#E0E7FF]/70",
      btnBg: "bg-[#E0E7FF] text-[#4338CA] hover:bg-[#6366F1] hover:text-white",
      border: "border-[#C7D2FE]",
    },
  };

  // Select pastel accent deterministically based on product ID
  const selectedTheme =
    product.id.includes("aranha") || product.id.includes("herois")
      ? bgThemes.blue
      : product.id.includes("vermelho") || product.id.includes("morango")
      ? bgThemes.rose
      : product.id.includes("festa") || product.id.includes("ouro")
      ? bgThemes.cream
      : bgThemes.lavender;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative pt-16 sm:pt-20 pb-5 px-5 rounded-[2.5rem] bg-white border border-[#EDE9FE] shadow-md hover:shadow-2xl hover:shadow-[#8B5CF6]/20 transition-all duration-500 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2.5 active:scale-[0.98] motion-reduce:transform-none select-none"
    >
      {/* FLOATING CAKE POPPING OUT OF THE CARD (EXACT REFERENCE DESIGN) */}
      <div className="absolute -top-12 sm:-top-16 inset-x-0 flex justify-center pointer-events-none z-10">
        <div className="relative">
          {/* Cake on circular plate with realistic depth */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-white shadow-[0_18px_25px_rgba(0,0,0,0.18)] border-2 border-white/80 overflow-hidden transform group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-500 ease-out">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/images/hero01.jpg";
              }}
            />
          </div>

          {/* Realistic drop shadow underneath the cake base */}
          <div className="w-28 sm:w-36 h-3.5 bg-black/20 rounded-full blur-md mx-auto -mt-2 group-hover:scale-95 group-hover:opacity-70 transition-all duration-500"></div>

          {/* Badge over Cake */}
          {product.badge && (
            <span className="absolute -top-1 -right-1 bg-[#1C1C2E] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-white">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Decorative soft wave header inside the card container */}
      <div
        className={`absolute top-0 inset-x-0 h-28 rounded-t-[2.5rem] ${selectedTheme.topWave} -z-0 opacity-80`}
      ></div>

      {/* Card Body Content */}
      <div className="relative z-10 mt-6 sm:mt-8 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Title in bold */}
          <h3 className="text-base sm:text-lg font-bold text-[#1C1C2E] group-hover:text-[#7C3AED] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Star Ratings (matching reference image) */}
          <div className="flex items-center space-x-1 mt-1 text-xs font-semibold text-[#1C1C2E]">
            <div className="flex text-amber-500 text-sm">
              {"★".repeat(Math.floor(product.rating))}
            </div>
            <span className="text-xs font-bold text-[#1C1C2E]">
              ({product.rating.toFixed(1)})
            </span>
          </div>

          {/* Slices count tag */}
          <p className="text-[11px] text-[#6B7280] mt-1 font-medium line-clamp-1">
            {product.sizes[0]?.slices || "Sob medida"} • {product.sizes[0]?.name || "Artesanal"}
          </p>
        </div>

        {/* Card Footer: "Start from / A partir de" + Price + Circular Arrow Button */}
        <div className="pt-3 border-t border-[#F5F3FF] flex items-center justify-between gap-2 mt-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block leading-none tracking-wider">
              A partir de
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#1C1C2E]">
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          {/* Circular Arrow Button (matching reference image `>`) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 shadow-xs group-hover:scale-105 ${selectedTheme.btnBg}`}
            aria-label={`Personalizar ${product.name}`}
          >
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
