import React from "react";
import { Product } from "../types.ts";
import ProductCard from "./ProductCard.tsx";
import { formatCurrency } from "../utils/whatsapp.ts";

interface PopularSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
}

export const PopularSection: React.FC<PopularSectionProps> = ({
  products,
  onOpenDetails,
}) => {
  const popularProducts = products.filter((p) => p.isPopular);
  const otherHighlights = products.filter((p) => !p.isPopular).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. TOP CAKES (Matching "Top Cakes" in Reference Image) */}
      <div className="mb-8 sm:mb-12">
        <div className="mb-14 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C2E] font-serif">
            Top Bolos
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-normal">
            Nossa coleção mais saborosa e elogiada desta semana!
          </p>
        </div>

        {/* Responsive Grid with Generous Gap for Pop-Out Cakes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-6 sm:gap-x-7 pt-4">
          {popularProducts.slice(0, 4).map((p) => (
            <ProductCard
              key={`pop-${p.id}`}
              product={p}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      </div>

      {/* 2. OTHER TOP CAKES (Matching "Other Top Cakes this week" in Reference Image) */}
      {otherHighlights.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C2E] font-serif">
              Outros Bolos em Destaque
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Sabores artesanais irresistíveis preparados pela confeiteira
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherHighlights.map((cake, idx) => {
              const bgColors = ["bg-[#EDE9FE]", "bg-[#FCE7F3]", "bg-[#FEF3C7]", "bg-[#E0E7FF]"];
              const bgClass = bgColors[idx % bgColors.length];

              return (
                <div
                  key={`other-${cake.id}`}
                  onClick={() => onOpenDetails(cake)}
                  className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#DDD6FE]/80 hover:border-[#8B5CF6] shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer group transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Round Cake Thumbnail on Soft Pastel Badge */}
                    <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl ${bgClass} p-1 flex-shrink-0 relative shadow-sm`}>
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1C1C2E] group-hover:text-[#8B5CF6] transition-colors truncate">
                        {cake.name}
                      </h4>

                      <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-0.5">
                        <span>★</span>
                        <span className="text-[#1C1C2E] text-[11px]">
                          {cake.rating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#6B7280] mt-0.5 font-medium">
                        A partir de{" "}
                        <strong className="text-[#1C1C2E]">
                          {formatCurrency(cake.basePrice)}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Arrow Chevron (Matching Reference Image) */}
                  <div className="w-8 h-8 rounded-full bg-[#F5F3FF] group-hover:bg-[#8B5CF6] text-[#7C3AED] group-hover:text-white flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ml-2">
                    ›
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default PopularSection;
