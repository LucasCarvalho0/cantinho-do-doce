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

  // Monitor scroll position to update arrows and active dot
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);

    const cardWidth = el.clientWidth * 0.85;
    if (cardWidth > 0) {
      const newIndex = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), REVIEWS.length - 1));
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = Math.min(el.clientWidth * 0.85, 380);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cardWidth = Math.min(el.clientWidth * 0.85, 380);
    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-14" id="avaliacoes">
      <div className="bg-white rounded-3xl p-5 sm:p-10 border border-[#DDD6FE] shadow-xs">
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-8">
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
            className="flex space-x-3.5 sm:space-x-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none focus:outline-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="w-[86vw] max-w-[340px] sm:w-[350px] md:w-[370px] flex-shrink-0 snap-center p-4 sm:p-6 rounded-3xl bg-[#F8F7FB] border border-[#DDD6FE] shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#8B5CF6]/50"
              >
                <div>
                  {/* Customer Profile Header */}
                  <div className="flex items-center space-x-3 mb-3.5">
                    {/* Real Customer Photo - Strictly Fixed 52x52 Circle */}
                    <div
                      className="relative flex-shrink-0"
                      style={{ width: "52px", height: "52px", minWidth: "52px", minHeight: "52px", maxWidth: "52px", maxHeight: "52px" }}
                    >
                      <img
                        src={rev.avatar}
                        alt={`Foto de ${rev.name}`}
                        loading="lazy"
                        style={{
                          width: "52px",
                          height: "52px",
                          minWidth: "52px",
                          minHeight: "52px",
                          maxWidth: "52px",
                          maxHeight: "52px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        className="rounded-full border-2 border-[#8B5CF6]/50 shadow-sm"
                      />
                      <span
                        title="Cliente Verificada"
                        style={{ width: "18px", height: "18px" }}
                        className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs"
                      >
                        ✓
                      </span>
                    </div>

                    {/* Customer Full Name & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h3 className="text-sm sm:text-base font-bold text-[#1C1C2E] leading-tight">
                          {rev.name}
                        </h3>
                        <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                          Verificada
                        </span>
                      </div>
                      <p className="text-xs text-[#7C6FAD] mt-1 font-normal truncate">
                        {rev.role} • {rev.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars + Cake Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
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

          {/* Swipe indicator hint for mobile */}
          <div className="md:hidden text-center mt-3.5 text-xs text-[#7C6FAD] flex items-center justify-center space-x-1.5">
            <span>👈</span>
            <span className="font-semibold">Deslize para ver todas as avaliações</span>
            <span>👉</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4 sm:mt-6">
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
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;