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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
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
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Temático Homem-Aranha",
    comment:
      "Fiz o pedido do bolo temático para o meu filho e a Janaína cuidou de cada detalhe com muito carinho. O topo personalizado ficou perfeito e idêntico à foto que mandei! Não sobrou nem uma fatia para contar história.",
    date: "Novembro de 2026",
  },
  {
    id: "rev-3",
    name: "Juliana Ferreira",
    role: "Celebração em Família",
    location: "Vila Pinheiro, Itatiaia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
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
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
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
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Dois Amores com Topo",
    comment:
      "O capricho da Janaína é diferenciado demais! O topo de bolo personalizado veio lindo, cores vivas e o bolo chegou perfeito. Atendimento nota 10 do início ao fim.",
    date: "Outubro de 2026",
  },
  {
    id: "rev-6",
    name: "Patrícia Souza",
    role: "Chá de Bebê",
    location: "Itatiaia - RJ",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&auto=format&fit=crop&q=80",
    stars: 5,
    cakeType: "Bolo Branco Suave com Brigadeiro",
    comment:
      "Massa fofinha, recheio na medida certa sem ser enjoativo. Chegou intacto, impecável e fez o maior sucesso nas fotos da comemoração! Com certeza pedirei de novo.",
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

    const cardWidth = el.clientWidth * 0.85; // approximate width of item
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

    const scrollAmount = el.clientWidth * 0.85;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cardWidth = el.clientWidth * 0.85;
    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="avaliacoes">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDD6FE] shadow-xs">
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8B5CF6] uppercase tracking-wider mb-1">
            <span>⭐ Opinião das Clientes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C2E] font-serif">
            Avaliações & Experiências
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 leading-relaxed">
            Veja o que dizem quem já provou e se encantou com os bolos artesanais da Janaína Mendes.
          </p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#F5F3FF] px-4 py-2 rounded-2xl border border-[#DDD6FE]">
            <div className="flex text-amber-500 text-sm sm:text-base tracking-wider">★★★★★</div>
            <span className="text-xs sm:text-sm font-extrabold text-[#1C1C2E] whitespace-nowrap">
              5.0 de 5.0
            </span>
            <span className="text-[11px] sm:text-xs text-[#7C6FAD] whitespace-nowrap">
              • 100% de clientes satisfeitas
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
            <span className="text-xl font-bold">‹</span>
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
            <span className="text-xl font-bold">›</span>
          </button>

          {/* Scrollable / Swipeable Track */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            tabIndex={0}
            role="region"
            aria-label="Carrossel de avaliações de clientes"
            className="flex space-x-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1 scrollbar-none focus:outline-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="w-[85vw] sm:w-[340px] md:w-[360px] flex-shrink-0 snap-center p-5 sm:p-6 rounded-3xl bg-[#F8F7FB] border border-[#DDD6FE] shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-[#8B5CF6]/50"
              >
                {/* Top Profile Card with Woman Photo */}
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={rev.avatar}
                      alt={`Foto de ${rev.name}`}
                      loading="lazy"
                      className="w-13 h-13 rounded-full object-cover border-2 border-[#8B5CF6] shadow-sm flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-extrabold text-[#1C1C2E] truncate font-serif">
                          {rev.name}
                        </h3>
                        <span
                          title="Cliente com pedido verificado"
                          className="inline-flex items-center text-[10px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                        >
                          ✓ Verificada
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7C6FAD] truncate font-medium">
                        {rev.role} • {rev.location}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars + Cake Tag */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex text-amber-500 text-xs">
                      {"★".repeat(rev.stars)}
                    </div>
                    <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#EDE9FE] px-2 py-0.5 rounded-full truncate max-w-[170px]">
                      {rev.cakeType}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-[#374151] leading-relaxed italic">
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
          <div className="md:hidden text-center mt-3 text-[11px] text-[#7C6FAD] flex items-center justify-center space-x-1">
            <span>👈</span>
            <span className="font-semibold">Deslize para o lado para ver mais</span>
            <span>👉</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4 sm:mt-6">
            {REVIEWS.map((rev, idx) => (
              <button
                key={rev.id}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Ir para avaliação ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
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