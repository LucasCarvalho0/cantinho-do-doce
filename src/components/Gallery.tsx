import React, { useState } from "react";
import { GalleryItem, GalleryCategory } from "../types";
import { SparklesIcon, EyeIcon } from "./Icons";

interface GalleryProps {
  items: GalleryItem[];
  onOpenLightbox: (src: string, alt: string, index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onOpenLightbox }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");

  const categories: { key: GalleryCategory; label: string }[] = [
    { key: "all", label: "Todos os Trabalhos" },
    { key: "infantil", label: "Infantil & Temáticos" },
    { key: "casamento", label: "Casamentos & Noivas" },
    { key: "elegantes", label: "Elegantes & Sofisticados" },
    { key: "festas", label: "Festas & Confraternizações" },
  ];

  const filteredItems = items.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-gradient-to-b from-purple-50/70 via-white to-purple-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Portfólio Real de Criações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Galeria de Inspirações
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Fotografias reais dos bolos produzidos pela Janaína Mendes para aniversários, casamentos e comemorações. Clique em qualquer foto para ampliar.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-14">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 border ${
                activeCategory === cat.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md border-transparent scale-105"
                  : "bg-white text-gray-700 hover:bg-purple-50 border-purple-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-purple-100 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-purple-100"
              onClick={() => onOpenLightbox(item.src, item.alt, index)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/images/hero01.jpg";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                <span className="text-[10px] sm:text-xs font-semibold text-pink-300 uppercase tracking-wider">
                  {item.category}
                </span>
                <p className="text-xs sm:text-sm text-white font-medium line-clamp-2">
                  {item.alt}
                </p>
                <div className="mt-2 flex items-center text-white/90 text-xs">
                  <EyeIcon className="w-3.5 h-3.5 mr-1 text-pink-400" />
                  <span>Clique para ampliar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
