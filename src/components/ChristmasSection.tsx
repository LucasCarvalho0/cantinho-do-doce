import React from "react";
import { Product } from "../types.ts";
import { formatCurrency } from "../utils/whatsapp.ts";
import { SparklesIcon } from "./Icons.tsx";

interface ChristmasSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  isActive?: boolean;
}

export const ChristmasSection: React.FC<ChristmasSectionProps> = ({
  products,
  onOpenDetails,
  isActive = true,
}) => {
  if (!isActive) return null;

  const christmasList = products.filter((p) => p.category === "natal-anonovo");

  // Bolo Especial de Natal (natal.jpg)
  const natalCake =
    christmasList.find((p) => p.id === "bolo-natalino-especial" || p.image.includes("natal")) ||
    products.find((p) => p.image.includes("natal")) ||
    christmasList[0];

  // Bolo Especial de Ano Novo (ano_novo.jpg)
  const anoNovoCake =
    christmasList.find((p) => p.id === "bolo-reveillon-dourado" || p.image.includes("ano_novo")) ||
    products.find((p) => p.image.includes("ano_novo")) ||
    christmasList[1];

  return (
    <section id="natal-especial" className="py-12 sm:py-16 bg-[#FDFBF7] border-y border-[#EDE9FE]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-[#EDE9FE] px-4 py-1.5 rounded-full border border-[#C4B5FD] text-xs font-bold text-[#5B21B6] mb-3">
            <SparklesIcon className="w-4 h-4 text-[#8B5CF6]" />
            <span>Edição Especial de Fim de Ano 2027</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1C1C2E] tracking-tight">
            Natal Especial — Cantinho Doce
          </h2>

          <p className="text-xs sm:text-sm text-[#6B7280] mt-2.5 leading-relaxed">
            Celebre momentos mágicos com nossa seleção exclusiva para as ceias de Natal e Réveillon. Produção artesanal com reserva antecipada e vagas limitadas.
          </p>

          <div className="mt-4 inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-[#DDD6FE] text-xs text-[#5B21B6] shadow-2xs">
            <span>✨</span>
            <span className="font-semibold">50% de entrada na confirmação para reserva de data</span>
          </div>
        </div>

        {/* The Two Independent Highlight Cakes: Natal & Ano Novo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 lg:gap-x-12 max-w-4xl mx-auto pt-6">
          {/* IMAGEM 1: BOLO ESPECIAL DE NATAL (natal.jpg) */}
          {natalCake && (
            <div
              onClick={() => onOpenDetails(natalCake)}
              className="group relative pt-16 sm:pt-20 pb-6 px-6 rounded-[2.5rem] bg-white border border-[#DDD6FE] shadow-lg hover:shadow-2xl hover:shadow-[#8B5CF6]/20 transition-all duration-500 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2.5 active:scale-[0.98]"
            >
              {/* Floating Cake Pop-Out */}
              <div className="absolute -top-14 sm:-top-16 inset-x-0 flex justify-center pointer-events-none z-10">
                <div className="relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-white shadow-[0_20px_30px_rgba(0,0,0,0.20)] border-2 border-red-200 overflow-hidden transform group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-500">
                    <img
                      src="/images/natal.jpg"
                      alt={natalCake.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/images/bolo_vermelho_28cm.jpg";
                      }}
                    />
                  </div>
                  <div className="w-32 sm:w-40 h-4 bg-black/20 rounded-full blur-md mx-auto -mt-2"></div>

                  <span className="absolute -top-1 -right-1 bg-[#8B263E] text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md border border-white">
                    🎄 Especial de Natal
                  </span>
                </div>
              </div>

              {/* Decorative wave header */}
              <div className="absolute top-0 inset-x-0 h-28 rounded-t-[2.5rem] bg-[#FCE7F3]/70 -z-0"></div>

              {/* Content */}
              <div className="relative z-10 mt-8 sm:mt-10 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mb-1">
                    <span>★★★★★</span>
                    <span className="text-[#1C1C2E] text-xs">({natalCake.rating.toFixed(1)})</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1C1C2E] group-hover:text-[#7C3AED] transition-colors leading-snug">
                    {natalCake.name}
                  </h3>

                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 mt-1">
                    {natalCake.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5F3FF] flex items-center justify-between gap-3 mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block leading-none">
                      A partir de
                    </span>
                    <span className="text-lg font-extrabold text-[#1C1C2E]">
                      {formatCurrency(natalCake.basePrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#8B5CF6] group-hover:bg-[#7C3AED] shadow-sm transition-all duration-300"
                  >
                    Personalizar ›
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* IMAGEM 2: BOLO ESPECIAL DE ANO NOVO (ano_novo.jpg) */}
          {anoNovoCake && (
            <div
              onClick={() => onOpenDetails(anoNovoCake)}
              className="group relative pt-16 sm:pt-20 pb-6 px-6 rounded-[2.5rem] bg-white border border-[#DDD6FE] shadow-lg hover:shadow-2xl hover:shadow-[#8B5CF6]/20 transition-all duration-500 cursor-pointer flex flex-col justify-between transform hover:-translate-y-2.5 active:scale-[0.98]"
            >
              {/* Floating Cake Pop-Out */}
              <div className="absolute -top-14 sm:-top-16 inset-x-0 flex justify-center pointer-events-none z-10">
                <div className="relative">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-2 bg-white shadow-[0_20px_30px_rgba(0,0,0,0.20)] border-2 border-amber-200 overflow-hidden transform group-hover:scale-110 group-hover:-translate-y-1.5 transition-all duration-500">
                    <img
                      src="/images/ano_novo.jpg"
                      alt={anoNovoCake.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/images/bolo_branco_dourado_festa.jpg";
                      }}
                    />
                  </div>
                  <div className="w-32 sm:w-40 h-4 bg-black/20 rounded-full blur-md mx-auto -mt-2"></div>

                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md border border-white">
                    ✨ Especial de Ano Novo
                  </span>
                </div>
              </div>

              {/* Decorative wave header */}
              <div className="absolute top-0 inset-x-0 h-28 rounded-t-[2.5rem] bg-[#FEF3C7]/60 -z-0"></div>

              {/* Content */}
              <div className="relative z-10 mt-8 sm:mt-10 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mb-1">
                    <span>★★★★★</span>
                    <span className="text-[#1C1C2E] text-xs">({anoNovoCake.rating.toFixed(1)})</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#1C1C2E] group-hover:text-[#7C3AED] transition-colors leading-snug">
                    {anoNovoCake.name}
                  </h3>

                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 mt-1">
                    {anoNovoCake.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5F3FF] flex items-center justify-between gap-3 mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block leading-none">
                      A partir de
                    </span>
                    <span className="text-lg font-extrabold text-[#1C1C2E]">
                      {formatCurrency(anoNovoCake.basePrice)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#8B5CF6] group-hover:bg-[#7C3AED] shadow-sm transition-all duration-300"
                  >
                    Personalizar ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChristmasSection;
