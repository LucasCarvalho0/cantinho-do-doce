import React, { useState } from "react";
import { Cake } from "../types";
import { formatCurrency } from "../utils/whatsapp";
import { CakeIcon, SparklesIcon, EyeIcon } from "./Icons";

interface CakesCatalogProps {
  products: Cake[];
  onSelectCake: (cake: Cake) => void;
  onOpenLightbox: (src: string, alt: string) => void;
}

export const CakesCatalog: React.FC<CakesCatalogProps> = ({
  products,
  onSelectCake,
  onOpenLightbox,
}) => {
  const [formatFilter, setFormatFilter] = useState<"all" | "round" | "square">("all");

  const filteredProducts = products.filter((p) => {
    // Only standard cakes (not christmas special) in this section
    if (p.is_christmas) return false;
    if (formatFilter === "all") return true;
    return p.type === formatFilter;
  });

  const roundCount = products.filter((p) => !p.is_christmas && p.type === "round").length;
  const squareCount = products.filter((p) => !p.is_christmas && p.type === "square").length;

  return (
    <section id="bolos" className="py-16 sm:py-24 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
            <CakeIcon className="w-3.5 h-3.5" />
            <span>Cardápio & Valores Oficiais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Nossos Bolos Artesanais
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Escolha o formato e tamanho ideal para sua comemoração. Cada bolo é preparado com ingredientes nobres, massa molhadinha e muito carinho.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2.5 sm:gap-4 mb-10 sm:mb-14">
          <button
            onClick={() => setFormatFilter("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              formatFilter === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg border-transparent scale-105"
                : "bg-white text-gray-700 hover:bg-purple-50 border-purple-200"
            }`}
          >
            Todos os Formatos ({products.filter((p) => !p.is_christmas).length})
          </button>
          <button
            onClick={() => setFormatFilter("round")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              formatFilter === "round"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg border-transparent scale-105"
                : "bg-white text-gray-700 hover:bg-purple-50 border-purple-200"
            }`}
          >
            Redondos ({roundCount})
          </button>
          <button
            onClick={() => setFormatFilter("square")}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              formatFilter === "square"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg border-transparent scale-105"
                : "bg-white text-gray-700 hover:bg-purple-50 border-purple-200"
            }`}
          >
            Quadrados ({squareCount})
          </button>
        </div>

        {/* Cake Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((cake, idx) => (
            <div
              key={`${cake.type}-${cake.cm}-${idx}`}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 flex flex-col group transform hover:-translate-y-1"
            >
              {/* Image with zoom badge */}
              <div
                className="relative aspect-square overflow-hidden bg-purple-50 cursor-pointer"
                onClick={() =>
                  onOpenLightbox(
                    cake.image,
                    `Bolo ${cake.type === "round" ? "Redondo" : "Quadrado"} ${cake.cm}cm - ${cake.slices}`
                  )
                }
              >
                <img
                  src={cake.image}
                  alt={`Bolo ${cake.type === "round" ? "Redondo" : "Quadrado"} ${cake.cm}cm`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to placeholder if image link breaks
                    e.currentTarget.src = "/images/hero01.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white/90 text-purple-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1">
                    <EyeIcon className="w-3.5 h-3.5" />
                    <span>Ampliar Foto</span>
                  </span>
                </div>

                {/* Slices Badge */}
                <div className="absolute top-3 left-3 bg-purple-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                  {cake.slices}
                </div>

                {/* Format Tag */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-purple-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {cake.type === "round" ? "Redondo" : "Quadrado"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 font-serif">
                      {cake.cm}cm {cake.type === "round" ? "Redondo" : "Quadrado"}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    {cake.description ||
                      `Bolo ${cake.type === "round" ? "redondo" : "quadrado"} artesanal com até 2 recheios à sua escolha e cobertura à combinar.`}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">Valor a partir de</span>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(cake.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectCake(cake)}
                    className="w-full inline-flex items-center justify-center py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                    Montar Encomenda
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CakesCatalog;
