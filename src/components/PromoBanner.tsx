import React from "react";
import { SparklesIcon } from "./Icons.tsx";

interface PromoBannerProps {
  onExploreCampaign: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onExploreCampaign }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1C2E] via-[#2D2B55] to-[#5B21B6] text-white shadow-xl">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle,rgba(196,181,253,0.1)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 sm:p-10 relative z-10">
          {/* Text Content */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-[#C4B5FD]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#C4B5FD]" />
              <span>Campanha Festiva 2027</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight leading-tight text-white">
              Bolos Especiais de <br className="hidden sm:inline" />
              <span className="text-[#C4B5FD]">Natal & Ano Novo</span>
            </h2>

            <p className="text-xs sm:text-base text-[#EDE9FE] max-w-lg leading-relaxed font-light">
              Transforme a sua mesa de fim de ano com bolos temáticos artesanais, frutas selecionadas, laços decorativos e recheios nobres preparados pela Janaína.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreCampaign}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold text-[#1C1C2E] bg-white hover:bg-[#EDE9FE] shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span>🎂 Ver Cardápio de Fim de Ano</span>
                <span className="ml-2">→</span>
              </button>

              <span className="text-[11px] sm:text-xs text-[#C4B5FD] font-medium">
                ⚡ Vagas limitadas para o dia 24 e 31/12
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#8B5CF6]/40">
                <img
                  src="/images/bolo_vermelho_28cm.jpg"
                  alt="Bolo Natalino Especial"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-3 left-2 sm:-left-3 bg-white text-[#1C1C2E] px-3.5 py-2 rounded-2xl shadow-lg border border-[#DDD6FE] flex items-center space-x-2">
                <span className="text-amber-500 font-bold text-sm">⭐ 5.0</span>
                <span className="text-[11px] text-[#7C6FAD] font-semibold">Mais elogiado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
