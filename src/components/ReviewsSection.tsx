import React from "react";

export const ReviewsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDD6FE] shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-1">
            <span>⭐ Opinião dos Clientes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C2E] font-serif">
            Avaliações & Experiências
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
            Nossos bolos são feitos sob medida para transformar momentos em memórias deliciosas.
          </p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#F5F3FF] px-4 py-2 rounded-2xl border border-[#DDD6FE]">
            <div className="flex text-amber-500 text-sm sm:text-base">★★★★★</div>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C1C2E] whitespace-nowrap">
              5.0 de 5.0
            </span>
            <span className="text-[11px] sm:text-xs text-[#7C6FAD] whitespace-nowrap">
              • Satisfação comprovada
            </span>
          </div>
        </div>

        {/* Real Customer Experience Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
            <div className="flex text-amber-500 text-xs">★★★★★</div>
            <p className="text-xs text-[#4C1D95] leading-relaxed italic">
              "O bolo de rosas para o aniversário da minha mãe superou todas as expectativas! Massa super molhadinha e o recheio de ninho com morangos frescos estava impecável."
            </p>
            <div className="pt-2 border-t border-[#DDD6FE] text-[11px] font-bold text-[#1C1C2E]">
              — Encomenda em Itatiaia
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
            <div className="flex text-amber-500 text-xs">★★★★★</div>
            <p className="text-xs text-[#4C1D95] leading-relaxed italic">
              "Fiz o pedido do bolo temático para o meu filho e a Janaína cuidou de cada detalhe com tanto carinho. Além de lindo na mesa, não sobrou um pedaço na festa!"
            </p>
            <div className="pt-2 border-t border-[#DDD6FE] text-[11px] font-bold text-[#1C1C2E]">
              — Aniversário Infantil
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
            <div className="flex text-amber-500 text-xs">★★★★★</div>
            <p className="text-xs text-[#4C1D95] leading-relaxed italic">
              "Excelente atendimento pelo WhatsApp, entrega pontual e acabamento profissional. O Cantinho Doce agora é o nosso ponto oficial de encomendas para toda a família."
            </p>
            <div className="pt-2 border-t border-[#DDD6FE] text-[11px] font-bold text-[#1C1C2E]">
              — Celebração em Família
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
