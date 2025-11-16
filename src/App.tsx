import React, { useState } from "react";
import Header from "./components/Header";
import { OrderModal } from "./components/OrderModal";
import { Order, Cake, GalleryCategory } from "./types";
import { ROUND_CAKES, SQUARE_CAKES, GALLERY_ITEMS } from "./constants";
import { ArrowDownIcon, InstagramIcon, FacebookIcon } from "./components/Icons";

const initialOrderState: Order = {
  isChristmasOrder: false,
  size: null,
  dough: null,
  fillings: [],
  topping: null,
  optionals: [],
  customer: {
    name: "",
    surname: "",
    whatsapp: "",
    pickupDate: "",
    eventType: "",
    themeDescription: "",
  },
};

const App: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<GalleryCategory>("all");

  const startChristmasOrder = () => {
    setOrder({ ...initialOrderState, isChristmasOrder: true });
  };

  const startStandardOrder = (preselectedCake: Cake | null = null) => {
    setOrder({
      ...initialOrderState,
      isChristmasOrder: false,
      size: preselectedCake,
    });
  };

  const closeModal = () => {
    setOrder(null);
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (!e.currentTarget.src.endsWith("placeholder-bolo.jpg")) {
      e.currentTarget.src = "/images/placeholder-bolo.jpg";
    }
  };

  const filteredGalleryItems = GALLERY_ITEMS.filter(
    (item) => galleryFilter === "all" || item.category === galleryFilter
  );

  const galleryCategories: { key: GalleryCategory; name: string }[] = [
    { key: "all", name: "Todos" },
    { key: "infantil", name: "Infantil" },
    { key: "casamento", name: "Casamento" },
    { key: "elegantes", name: "Elegantes" },
    { key: "festas", name: "Festas" },
  ];

  return (
    <div
      className="min-h-screen text-gray-800 font-sans bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero.png')",
      }}
    >
      <Header onChristmasOrder={startChristmasOrder} />

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
          {/* Background Image com overlay gradiente */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/public/images/hero01.jpg')" }}
          >
            {/* Overlay gradiente para melhor contraste do texto */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-700/60 to-purple-800/70"></div>
            {/* Efeito de brilho sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Conteúdo Principal */}
          <div className="relative z-10 p-4 sm:p-6 max-w-4xl mx-auto">
            {/* Título com animação */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl mb-4 sm:mb-6 animate-fade-in-up">
              Cantinho do Doce
            </h1>

            {/* Subtítulo com animação delay */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-2xl mx-auto drop-shadow-lg mb-6 sm:mb-8 leading-relaxed text-white font-light animate-fade-in-up animation-delay-300">
              Seu momento especial merece um bolo inesquecível.
            </p>

            {/* Botão CTA com animação */}
            <div className="flex justify-center animate-fade-in-up animation-delay-500">
              <a
                href="#bolos"
                className="inline-flex items-center justify-center bg-white text-purple-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full text-base sm:text-lg hover:bg-purple-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl min-h-[52px] border-2 border-white/20 hover:border-white/40 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300 mr-2">
                  🎂
                </span>
                Fazer minha encomenda
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </a>
            </div>
          </div>

          {/* Seta animada */}
          <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <a
              href="#bolos"
              aria-label="Scroll to cake section"
              className="block hover:scale-110 transition-transform duration-300"
            >
              <ArrowDownIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-2xl" />
            </a>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-300/20 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/3 right-20 w-12 h-12 bg-purple-300/30 rounded-full blur-md animate-pulse animation-delay-500"></div>
        </section>

        {/* Cakes Section */}
        <section
          id="bolos"
          className="py-12 sm:py-16 md:py-20 bg-white/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                Nossos Bolos
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Escolha o tamanho e formato ideal para sua comemoração. Todos os
                bolos são feitos com ingredientes de qualidade e muito carinho.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
              {/* Round Cakes */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Bolos Redondos
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {ROUND_CAKES.map((cake) => (
                    <div
                      key={`${cake.type}-${cake.cm}`}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 transition-all duration-300 hover:shadow-2xl hover:border-purple-200 group"
                    >
                      <div className="w-full sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 mx-auto sm:mx-0">
                        <img
                          src={cake.image}
                          alt={`Bolo Redondo de ${cake.cm}cm`}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-grow text-center sm:text-left w-full">
                        <p className="font-bold text-xl text-gray-800 mb-1">
                          {cake.cm}cm -{" "}
                          {cake.type === "round" ? "Redondo" : "Quadrado"}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {cake.slices}
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          R$ {cake.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <button
                        onClick={() => startStandardOrder(cake)}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg min-h-[52px] flex items-center justify-center group"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          🎂 Encomendar
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Square Cakes */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6 sm:mb-8 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Bolos Quadrados
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {SQUARE_CAKES.map((cake) => (
                    <div
                      key={`${cake.type}-${cake.cm}`}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 transition-all duration-300 hover:shadow-2xl hover:border-purple-200 group"
                    >
                      <div className="w-full sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 mx-auto sm:mx-0">
                        <img
                          src={cake.image}
                          alt={`Bolo Quadrado de ${cake.cm}cm`}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          onError={handleImageError}
                        />
                      </div>
                      <div className="flex-grow text-center sm:text-left w-full">
                        <p className="font-bold text-xl text-gray-800 mb-1">
                          {cake.cm}cm -{" "}
                          {cake.type === "round" ? "Redondo" : "Quadrado"}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {cake.slices}
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          R$ {cake.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <button
                        onClick={() => startStandardOrder(cake)}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg min-h-[52px] flex items-center justify-center group"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200">
                          🎂 Encomendar
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          id="galeria"
          className="py-12 sm:py-16 md:py-20 bg-purple-50/90 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                Galeria de Inspirações
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Veja alguns de nossos trabalhos e inspire-se para sua festa.
                Cada bolo é uma obra de arte feita com amor e dedicação.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12">
              {galleryCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setGalleryFilter(cat.key)}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-full transition-all duration-200 min-h-[44px] border ${
                    galleryFilter === cat.key
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg border-transparent transform scale-105"
                      : "bg-white text-gray-600 hover:bg-purple-100 border-gray-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredGalleryItems.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl shadow-lg group aspect-square bg-white"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section
          id="informacoes"
          className="py-12 sm:py-16 md:py-20 bg-white/95 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                Informações Importantes
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Tudo que você precisa saber antes de encomendar seu bolo dos
                sonhos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: "📋",
                  title: "Como Encomendar",
                  content:
                    "Use nosso sistema online para montar seu bolo passo a passo e envie o pedido para nosso WhatsApp para confirmação final.",
                },
                {
                  icon: "💳",
                  title: "Pagamento",
                  content:
                    "Para encomendas de Natal, pedimos 50% de entrada. Para as demais, o pagamento é feito na retirada. Aceitamos PIX, cartão e dinheiro.",
                },
                {
                  icon: "🚗",
                  title: "Retirada",
                  content:
                    "As retiradas são feitas em nosso endereço com data e horário previamente agendados para garantir que seu bolo esteja perfeito.",
                },
                {
                  icon: "⏰",
                  title: "Prazo de Encomenda",
                  content:
                    "Recomendamos encomendar com pelo menos 3 dias de antecedência. Para datas especiais como Natal, reserve com ainda mais antecedência.",
                },
                {
                  icon: "🎨",
                  title: "Personalização",
                  content:
                    "Todos os bolos podem ser personalizados! Converse conosco sobre temas, cores e decorações especiais para sua festa.",
                },
                {
                  icon: "📞",
                  title: "Atendimento",
                  content:
                    "Estamos disponíveis via WhatsApp para tirar todas suas dúvidas e ajudar na criação do bolo perfeito para sua comemoração.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contato"
          className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-800 mb-4">
                Nosso Endereço
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Venha retirar sua encomenda e conhecer nosso cantinho. Estamos
                ansiosos para te atender!
              </p>
            </div>
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
              <div className="h-64 sm:h-80 md:h-96 lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.3811887527086!2d-44.56412392492473!3d-22.48987697955072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9dd8082eccd3e1%3A0x3c959d8bd62d55c6!2sR.%20Quatorze%2C%2034%20-%20Cidade%20Jardim%20Itatiaia%2C%20Itatiaia%20-%20RJ%2C%2027580-000!5e0!3m2!1spt-BR!2sbr!4v1763307865511!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Endereço Cantinho do Doce - Rua Quatorze, 34"
                />
              </div>
              <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                  Rua Quatorze, nº 34 - Cidade Jardim Itatiaia
                </p>
                <p className="text-sm sm:text-base md:text-lg opacity-90 mb-3">
                  Itatiaia - RJ, 27580-000
                </p>
                <p className="text-sm sm:text-base font-medium opacity-90">
                  📍 Localização fácil e acessível para retirada das encomendas
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                  <a
                    href={`https://wa.me/5524999679906`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-105"
                  >
                    📞 WhatsApp
                  </a>
                  <a
                    href="https://maps.google.com/?q=Rua+Quatorze,34,Cidade+Jardim+Itatiaia,Itatiaia,RJ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200 transform hover:scale-105"
                  >
                    🗺️ Como chegar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-800 to-pink-700 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <img
              src="/public/images/cake01.png"
              alt="Logo Cantinho do Doce"
              className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg"
            />
            <span className="ml-3 text-xl sm:text-2xl font-bold drop-shadow-lg">
              Cantinho do Doce
            </span>
          </div>
          <p className="text-sm sm:text-base text-purple-200 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            Transformando momentos especiais em doces memórias através de bolos
            artesanais feitos com amor e dedicação.
          </p>
          <div className="flex justify-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
            <a
              href="https://www.instagram.com/cakecantinho/"
              className="hover:text-pink-300 transition-all duration-200 p-2 bg-white/10 rounded-full hover:bg-white/20 transform hover:scale-110"
            >
              <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-pink-300 transition-all duration-200 p-2 bg-white/10 rounded-full hover:bg-white/20 transform hover:scale-110"
            >
              <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>
          <p className="text-xs sm:text-sm text-purple-300">
            &copy; {new Date().getFullYear()} Cantinho do Doce - Janaína Mendes.
            Todos os direitos reservados. | Feito com ❤️ e muito açúcar
          </p>
        </div>
      </footer>

      {order && (
        <OrderModal
          order={order}
          onClose={closeModal}
          onOrderChange={updateOrder}
        />
      )}
    </div>
  );
};

export default App;
