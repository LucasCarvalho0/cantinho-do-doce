import React from "react";
import { ProductCategory } from "../types.ts";

interface CategoryChipsProps {
  activeCategory: ProductCategory | "todos";
  onSelectCategory: (cat: ProductCategory | "todos") => void;
  counts: Record<ProductCategory | "todos", number>;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const categories: { id: ProductCategory | "todos"; label: string; icon: string }[] = [
    { id: "todos", label: "Todos os Bolos", icon: "🍰" },
    { id: "bolos-aniversario", label: "Bolos de Aniversário", icon: "🎂" },
    { id: "bolos-personalizados", label: "Bolos Personalizados", icon: "✨" },
    { id: "bolos-caseiros", label: "Bolos Caseiros", icon: "☕" },
    { id: "natal-anonovo", label: "Natal & Ano Novo", icon: "🎄" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/30 transform scale-[1.02]"
                  : "bg-white text-[#4C1D95] hover:text-[#1C1C2E] hover:bg-[#EDE9FE] border-[#DDD6FE]"
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? "bg-white/25 text-white" : "bg-[#EDE9FE] text-[#7C3AED]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;
