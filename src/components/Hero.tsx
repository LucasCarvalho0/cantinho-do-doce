import React from "react";
import { SparklesIcon, MapPinIcon } from "./Icons";

interface HeroProps {
  onExploreCatalog: () => void;
  onStartOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onStartOrder,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F3FF] via-white to-[#FAFAFE] py-10 sm:py-16 lg:py-20 border-b border-[#DDD6FE]/60">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EDE9FE] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-[#DDD6FE]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LADO ESQUERDO: Apresentação, Título Elegante, Descrição, Botões */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag de Apresentação */}
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#DDD6FE] shadow-2xs text-xs font-bold text-[#5B21B6] mx-auto lg:mx-0">
              <SparklesIcon className="w-4 h-4 text-[#8B5CF6]" />
              <span>Confeitaria Artesanal Premium • Itatiaia - RJ</span>
            </div>

            {/* Título Principal Elegante */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-[#1C1C2E] tracking-tight leading-[1.15]">
              Bolos que transformam momentos em{" "}
              <span className="text-[#8B5CF6] relative inline-block">
                memórias inesquecíveis
                <span className="absolute bottom-1 left-0 w-full h-2 bg-[#EDE9FE] -z-10 rounded-full"></span>
              </span>
            </h1>

            {/* Descrição Curta */}
            <p className="text-sm sm:text-base lg:text-lg text-[#6B7280] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Produzidos artesanalmente por <strong>Janaína Mendes</strong> com massas fofinhas, recheios nobres e decorações exclusivas para aniversários, festas e ocasiões especiais.
            </p>

            {/* Indicadores rápidos de confiança */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-[#4C1D95] font-semibold">
              <span className="flex items-center space-x-1.5 bg-[#F5F3FF] px-3 py-1.5 rounded-full border border-[#DDD6FE]">
                <span>⭐</span>
                <span>Avaliação 5.0 (Clientes Reais)</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-[#F5F3FF] px-3 py-1.5 rounded-full border border-[#DDD6FE]">
                <MapPinIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Cidade Jardim Itatiaia</span>
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg shadow-[#8B5CF6]/30 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>🎂 Conhecer o Cardápio</span>
                <span>→</span>
              </button>

              <button
                onClick={onStartOrder}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-sm sm:text-base font-bold text-[#1C1C2E] bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>🛍️ Fazer Encomenda</span>
              </button>
            </div>
          </div>

          {/* LADO DIREITO: Fotografia Grande com Efeito de Profundidade Pop-Out */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              {/* Moldura de fundo com sombra natural multicamada */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#8B5CF6]/20 via-[#EDE9FE]/50 to-transparent rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Contêiner da Imagem Principal */}
              <div className="relative rounded-[2rem] overflow-visible bg-white p-3 border border-[#DDD6FE] shadow-2xl shadow-[#1C1C2E]/10 transform transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-3xl">
                <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[#F5F3FF] relative">
                  <img
                    src="/images/jana-img.jpg"
                    alt="Janaína Mendes — Confeiteira Artesanal Cantinho Doce"
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105 drop-shadow-md"
                    loading="eager"
                  />
                  {/* Gradiente sutil na borda para dar sensação de profundidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C2E]/30 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                </div>

                {/* Selo Flutuante 1: Satisfação Comprovada */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-[#DDD6FE] flex items-center space-x-1.5 text-xs font-bold text-[#1C1C2E] animate-float">
                  <span className="text-amber-500">★</span>
                  <span>5.0</span>
                  <span className="text-[11px] text-[#6B7280] font-normal">• Destaque</span>
                </div>

                {/* Faixa Fixa: 100% Artesanal — canto inferior direito */}
                <div className="absolute -bottom-5 right-3 bg-[#1C1C2E] text-white py-2.5 px-4 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2">
                  <span className="text-base">🍰</span>
                  <div className="text-center">
                    <span className="text-[#C4B5FD] uppercase text-[9px] font-bold tracking-widest block leading-none">Produção</span>
                    <span className="text-xs font-extrabold text-white leading-tight">100% Artesanal</span>
                  </div>
                  <span className="text-[#8B5CF6] text-sm">✦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
