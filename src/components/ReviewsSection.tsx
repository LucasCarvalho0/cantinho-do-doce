import React, { useRef, useState, useEffect } from "react";

interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  stars: number;
  cakeType: string;
  comment: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Mariana Silva",
    role: "Aniversário de 15 Anos",
    location: "Itatiaia - RJ",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Floral com Rosas",
    comment:
      "O bolo de rosas para o aniversário da minha filha superou todas as expectativas! Massa super molhadinha e o recheio de ninho com morangos frescos estava impecável. Todos os convidados pediram o contato da Janaína!",
    date: "Novembro de 2026",
  },
  {
    id: "rev-2",
    name: "Camila Albuquerque",
    role: "Aniversário Infantil",
    location: "Cidade Jardim, Itatiaia",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Homem-Aranha",
    comment:
      "Fiz o pedido do bolo temático para o meu filho e a Janaína cuidou de cada detalhe com muito carinho. O topo personalizado ficou perfeito e idêntico à foto que mandei no WhatsApp! Não sobrou nem uma fatia para contar história.",
    date: "Novembro de 2026",
  },
  {
    id: "rev-3",
    name: "Juliana Ferreira",
    role: "Celebração em Família",
    location: "Vila Pinheiro, Itatiaia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Red Velvet Especial",
    comment:
      "Excelente atendimento pelo WhatsApp, retirada super pontual e organizada, e acabamento profissional digno de confeitaria de luxo. O Cantinho Doce agora é o nosso ponto oficial de encomendas para toda a família!",
    date: "Outubro de 2026",
  },
  {
    id: "rev-4",
    name: "Beatriz Rocha",
    role: "Festa de Noivado",
    location: "Penedo - RJ",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Chantininho Dourado",
    comment:
      "Bolo simplesmente maravilhoso tanto no visual quanto no sabor. O brigadeiro gourmet artesanal com crocante foi o ponto alto da sobremesa. Ninguém resistiu a repetir!",
    date: "Outubro de 2026",
  },
  {
    id: "rev-5",
    name: "Fernanda Lima",
    role: "Aniversário Surpresa",
    location: "Centro, Itatiaia",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Dois Amores",
    comment:
      "O capricho da Janaína é diferenciado demais! O topo de bolo personalizado que mandei por WhatsApp ficou perfeito e o bolo chegou intacto na comemoração. Atendimento nota 10!",
    date: "Outubro de 2026",
  },
  {
    id: "rev-6",
    name: "Patrícia Souza",
    role: "Chá de Bebê",
    location: "Itatiaia - RJ",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Suave com Morangos",
    comment:
      "Massa fofinha, recheio na medida certa sem ser enjoativo. Chegou impecável na retirada e fez o maior sucesso nas fotos da comemoração! Com certeza pedirei de novo.",
    date: "Setembro de 2026",
  },
];

export const ReviewsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Monitor scroll position to update arrows and active dot accurately
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length > 0) {
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;
      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const diff = Math.abs(scrollCenter - childCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const card = el.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.offsetWidth + 16 : el.clientWidth;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    if (children[index]) {
      children[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14" id="avaliacoes">
      <div className="bg-white rounded-3xl p-4 sm:p-8 md:p-10 border border-[#DDD6FE] shadow-xs">
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-1.5">
            <span>⭐ Depoimentos Reais de Clientes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C2E] tracking-tight">
            Avaliações & Experiências
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5 leading-relaxed">
            Veja o carinho de quem já celebrou momentos especiais com os bolos artesanais da Janaína Mendes.
          </p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#F5F3FF] px-4 py-2 rounded-2xl border border-[#DDD6FE]">
            <div className="flex text-amber-500 text-sm sm:text-base tracking-wider">★★★★★</div>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C1C2E] whitespace-nowrap">
              5.0 de 5.0
            </span>
            <span className="text-[11px] sm:text-xs text-[#7C6FAD] whitespace-nowrap">
              • Clientes satisfeitas em Itatiaia e Região
            </span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow Button (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => scrollTo("left")}
            disabled={!canScrollLeft}
            aria-label="Avaliação anterior"
            className={`hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center bg-white border border-[#DDD6FE] shadow-lg transition-all duration-200 ${
              canScrollLeft
                ? "text-[#4C1D95] hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] cursor-pointer"
                : "opacity-30 cursor-not-allowed text-gray-400"
            }`}
          >
            <span className="text-2xl font-bold leading-none">‹</span>
          </button>

          {/* Right Arrow Button (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => scrollTo("right")}
            disabled={!canScrollRight}
            aria-label="Próxima avaliação"
            className={`hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center bg-white border border-[#DDD6FE] shadow-lg transition-all duration-200 ${
              canScrollRight
                ? "text-[#4C1D95] hover:bg-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] cursor-pointer"
                : "opacity-30 cursor-not-allowed text-gray-400"
            }`}
          >
            <span className="text-2xl font-bold leading-none">›</span>
          </button>

          {/* Scrollable / Swipeable Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            tabIndex={0}
            role="region"
            aria-label="Carrossel de avaliações de clientes"
            className="flex space-x-3.5 sm:space-x-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-0.5 scrollbar-none focus:outline-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="w-full sm:w-[350px] md:w-[370px] flex-shrink-0 snap-center p-4 sm:p-6 rounded-3xl bg-[#F8F7FB] border border-[#DDD6FE] shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#8B5CF6]/50"
              >
                <div>
                  {/* Customer Profile Header */}
                  <div className="flex items-start gap-3 mb-3.5">
                    {/* Real Customer Photo — forced 52×52 circle, never grows */}
                    <div
                      className="relative flex-none"
                      style={{
                        width: "52px",
                        height: "52px",
                        minWidth: "52px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid rgba(139,92,246,0.5)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      }}
                    >
                      <img
                        src={rev.avatar}
                        alt={`Foto de ${rev.name}`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                      />
                      <span
                        title="Cliente Verificada"
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#10b981",
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid #fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                        }}
                      >
                        ✓
                      </span>
                    </div>

                    {/* Customer Full Name & Details — min-w-0 prevents text overflow */}
                    <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", flexWrap: "wrap" }}>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: "#1C1C2E",
                            lineHeight: 1.3,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {rev.name}
                        </h3>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            fontSize: "10px",
                            color: "#065f46",
                            background: "#ecfdf5",
                            border: "1px solid rgba(167,243,208,0.8)",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          Verificada
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#7C6FAD",
                          margin: "4px 0 0",
                          fontWeight: 400,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {rev.role} • {rev.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars + Cake Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex text-amber-500 text-xs tracking-wider">
                      {"★".repeat(rev.stars)}
                    </div>
                    <span className="text-[11px] font-semibold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      {rev.cakeType}
                    </span>
                  </div>

                  {/* Customer Review Text */}
                  <p className="text-xs sm:text-sm text-[#374151] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer of Card */}
                <div className="pt-3 mt-4 border-t border-[#DDD6FE] flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>{rev.date}</span>
                  <span className="text-[#8B5CF6] font-bold text-[10px]">
                    Cantinho Doce • Janaína
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Controls: Prev, Current/Total, Next */}
          <div className="flex items-center justify-between mt-4 md:hidden px-1">
            <button
              type="button"
              onClick={() => scrollTo("left")}
              disabled={!canScrollLeft}
              aria-label="Avaliação anterior"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                canScrollLeft
                  ? "bg-[#F5F3FF] border-[#8B5CF6] text-[#7C3AED] active:bg-[#8B5CF6] active:text-white"
                  : "opacity-40 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>‹ Anterior</span>
            </button>

            <span className="text-xs font-semibold text-[#7C6FAD]">
              {activeIndex + 1} de {REVIEWS.length}
            </span>

            <button
              type="button"
              onClick={() => scrollTo("right")}
              disabled={!canScrollRight}
              aria-label="Próxima avaliação"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                canScrollRight
                  ? "bg-[#F5F3FF] border-[#8B5CF6] text-[#7C3AED] active:bg-[#8B5CF6] active:text-white"
                  : "opacity-40 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span>Próxima ›</span>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-3 sm:mt-6">
            {REVIEWS.map((rev, idx) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Ir para avaliação de ${rev.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === idx
                    ? "w-7 h-2 bg-[#8B5CF6]"
                    : "w-2 h-2 bg-[#DDD6FE] hover:bg-[#C4B5FD]"
                }`}
              />
            ))}
          </div>

          {/* Swipe indicator hint for mobile */}
          <div className="md:hidden text-center mt-2.5 text-[11px] text-[#7C6FAD] flex items-center justify-center space-x-1.5">
            <span>👈</span>
            <span>Você também pode arrastar para o lado</span>
            <span>👉</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;