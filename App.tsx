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
    // Evita loop infinito caso a imagem placeholder também não seja encontrada.
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
      className="min-h-screen text-gray-800 font-sans"
      style={{
        backgroundImage: "url('/images/hero.png')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header onChristmasOrder={startChristmasOrder} />

      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center text-white bg-gradient-to-br from-purple-400 to-pink-300">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('/images/hero.jpg')" }}
          ></div>
          <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
              Cantinho do Doce
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Seu momento especial merece um bolo inesquecível.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#bolos"
                className="inline-block bg-white text-purple-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-purple-100 transition-transform transform hover:scale-105 shadow-lg"
              >
                Fazer minha encomenda
              </a>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <a href="#bolos" aria-label="Scroll to cake section">
              <ArrowDownIcon className="w-8 h-8 text-white drop-shadow-lg" />
            </a>
          </div>
        </section>

        {/* Cakes Section */}
        <section id="bolos" className="py-20 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-800">
                Nossos Bolos
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Escolha o tamanho e formato ideal para sua comemoração.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                  Bolos Redondos
                </h3>
                <div className="space-y-4">
                  {ROUND_CAKES.map((cake) => (
                    <div
                      key={`${cake.type}-${cake.cm}`}
                      className="bg-white p-4 rounded-lg shadow-md border border-purple-100 flex items-center gap-4 transition-shadow hover:shadow-xl"
                    >
                      <img
                        src={cake.image}
                        alt={`Bolo Redondo de ${cake.cm}cm`}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                        onError={handleImageError}
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-800">
                          {cake.cm}cm
                        </p>
                        <p className="text-sm text-gray-500">{cake.slices}</p>
                        <p className="text-purple-600 font-bold mt-2">
                          R$ {cake.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <button
                        onClick={() => startStandardOrder(cake)}
                        className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                      >
                        Encomendar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                  Bolos Quadrados
                </h3>
                <div className="space-y-4">
                  {SQUARE_CAKES.map((cake) => (
                    <div
                      key={`${cake.type}-${cake.cm}`}
                      className="bg-white p-4 rounded-lg shadow-md border border-purple-100 flex items-center gap-4 transition-shadow hover:shadow-xl"
                    >
                      <img
                        src={cake.image}
                        alt={`Bolo Quadrado de ${cake.cm}cm`}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                        onError={handleImageError}
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-lg text-gray-800">
                          {cake.cm}cm
                        </p>
                        <p className="text-sm text-gray-500">{cake.slices}</p>
                        <p className="text-purple-600 font-bold mt-2">
                          R$ {cake.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <button
                        onClick={() => startStandardOrder(cake)}
                        className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                      >
                        Encomendar
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
          className="py-20 bg-purple-50/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-800">
                Galeria de Inspirações
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Veja alguns de nossos trabalhos e inspire-se para sua festa.
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {galleryCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setGalleryFilter(cat.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    galleryFilter === cat.key
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-600 hover:bg-purple-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredGalleryItems.map((item, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg shadow-lg group"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section
          id="informacoes"
          className="py-20 bg-white/90 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-800">
                Informações Importantes
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Tudo que você precisa saber antes de encomendar.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Como Encomendar
                </h3>
                <p className="text-gray-600">
                  Use nosso sistema online para montar seu bolo e envie o pedido
                  para nosso WhatsApp para confirmação.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Pagamento
                </h3>
                <p className="text-gray-600">
                  Para encomendas de Natal, pedimos 50% de entrada. Para as
                  demais, o pagamento é feito na retirada. Aceitamos Pix e
                  cartão.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Retirada
                </h3>
                <p className="text-gray-600">
                  As retiradas são feitas em nosso endereço com data e horário
                  previamente agendados para garantir que seu bolo esteja
                  perfeito.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contato"
          className="py-20 bg-purple-50/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-800">
                Nosso Endereço
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Venha retirar sua encomenda e conhecer nosso cantinho.
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.3246222639563!2d-44.48763168500487!3d-22.420755785274736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94bdbabdc5f201%3A0x8e5f6c6e0e0f7e0!2sRua%2014%2C%20Jardim%20Itatiaia%2C%20Itatiaia%20-%20RJ%2C%2027580-000!5e0!3m2!1spt-BR!2sbr!4v1700846321234!5m2!1spt-BR!2sbr"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Endereço Cantinho do Doce"
              ></iframe>
              <div className="p-6 text-center">
                <p className="text-lg font-medium text-gray-800">
                  Rua 14, nº 34 - Jardim Itatiaia
                </p>
                <p className="text-gray-600">Itatiaia - RJ, 27580-000</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-purple-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/cake01.png"
              alt="Logo Cantinho do Doce"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-bold">Cantinho do Doce</span>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-pink-300 transition-colors">
              <InstagramIcon className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-pink-300 transition-colors">
              <FacebookIcon className="w-6 h-6" />
            </a>
          </div>
          <p className="text-sm text-purple-200">
            &copy; {new Date().getFullYear()} Cantinho do Doce - Janaína Mendes.
            Todos os direitos reservados.
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
