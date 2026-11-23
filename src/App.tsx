import React, { useState, useMemo, useEffect } from "react";
import { PRODUCTS, ProductCategory, Product } from "./data/products.ts";
import { CartProvider, useCart } from "./context/CartContext.tsx";
import { initPwaListeners } from "./utils/pwa.ts";
import { WHATSAPP_NUMBER } from "./utils/whatsapp.ts";

// Components
import Header from "./components/Header.tsx";
import Hero from "./components/Hero.tsx";
import ChristmasSection from "./components/ChristmasSection.tsx";
import CategoryChips from "./components/CategoryChips.tsx";
import PopularSection from "./components/PopularSection.tsx";
import ProductCard from "./components/ProductCard.tsx";
import ProductDetailModal from "./components/ProductDetailModal.tsx";
import CartDrawer from "./components/CartDrawer.tsx";
import CheckoutModal from "./components/CheckoutModal.tsx";
import ReviewsSection from "./components/ReviewsSection.tsx";
import PwaInstallBanner from "./components/PwaInstallBanner.tsx";
import Footer from "./components/Footer.tsx";
import OrderModal from "./components/OrderModal.tsx";
import { OrderSuccessModal } from "./components/OrderSuccessModal.tsx";
import Preloader from "./components/Preloader.tsx";
import { Order } from "./types.ts";
import { ROUND_CAKES, SQUARE_CAKES } from "./constants.ts";

export const AppContent: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "todos">("todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [canInstallPrompt, setCanInstallPrompt] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customOrder, setCustomOrder] = useState<Order>({
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
      eventType: "Aniversário",
      hasTopper: "não",
      themeDescription: "",
    },
  });
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderCode: string;
    customerName: string;
    subtotal: number;
    downPayment?: number;
    pickupDate: string;
    whatsappMessage: string;
    isChristmas: boolean;
  } | null>(null);

  const { totalItems, setIsCartOpen } = useCart();

  // Initialize PWA installation listeners (Android beforeinstallprompt & appinstalled)
  useEffect(() => {
    initPwaListeners(
      (canInstall) => setCanInstallPrompt(canInstall),
      () => console.log("Atualização do PWA disponível")
    );
  }, []);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "todos") return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  // Counts for category badges
  const categoryCounts = useMemo(() => {
    return {
      todos: PRODUCTS.length,
      "bolos-aniversario": PRODUCTS.filter((p) => p.category === "bolos-aniversario").length,
      "bolos-personalizados": PRODUCTS.filter((p) => p.category === "bolos-personalizados").length,
      "bolos-caseiros": PRODUCTS.filter((p) => p.category === "bolos-caseiros").length,
      "natal-anonovo": PRODUCTS.filter((p) => p.category === "natal-anonovo").length,
    };
  }, []);

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const scrollToCatalog = () => {
    setActiveCategory("todos");
    const el = document.getElementById("catalogo");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToChristmas = () => {
    setActiveCategory("natal-anonovo");
    const el = document.getElementById("natal-especial");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1C2E] font-sans selection:bg-[#EDE9FE] selection:text-[#5B21B6]">
      {/* Kinetic Morph Intro Preloader com Cores da Janaína & Especial Feliz 2027 */}
      <Preloader />

      {/* Header */}
      <Header
        onSelectCategory={(cat) => {
          setActiveCategory(cat as any);
          if (cat === "natal-anonovo") {
            scrollToChristmas();
          } else {
            scrollToCatalog();
          }
        }}
      />

      <main className="pb-24 sm:pb-0">
        {/* HERO SECTION (Section 4 - Conforme Composição Exigida) */}
        <Hero
          onExploreCatalog={scrollToCatalog}
          onStartOrder={() => setIsOrderModalOpen(true)}
        />

        {/* Category Navigation Pills (Matching Screen 1) */}
        <div id="categorias">
          <CategoryChips
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* POPULAR SECTION (Top Bolos + Outros Bolos da Semana) */}
        {activeCategory === "todos" && (
          <PopularSection
            products={PRODUCTS}
            onOpenDetails={handleOpenDetails}
          />
        )}

        {/* SEÇÃO ESPECIAL DE NATAL (Dois Bolos Destaque Independentes) */}
        <ChristmasSection
          products={PRODUCTS}
          onOpenDetails={handleOpenDetails}
          isActive={true}
        />

        {/* Main Products Catalog Grid */}
        <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-14">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C2E] font-serif">
                {activeCategory === "todos"
                  ? "Cardápio Completo de Bolos"
                  : activeCategory === "bolos-aniversario"
                  ? "Bolos de Aniversário & Comemorações"
                  : activeCategory === "bolos-personalizados"
                  ? "Bolos Artísticos & Personalizados"
                  : activeCategory === "bolos-caseiros"
                  ? "Bolos Caseiros & Tradicionais"
                  : "Especial Fim de Ano (Natal & Réveillon)"}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1 font-normal">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "opção encontrada" : "opções encontradas"} para você escolher
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#DDD6FE] max-w-md mx-auto my-8 shadow-xs">
              <span className="text-4xl block mb-3">🎂</span>
              <h3 className="text-base font-bold text-[#1C1C2E]">
                Nenhum bolo encontrado nesta categoria
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                Selecione outra categoria acima para ver mais opções artesanais.
              </p>
              <button
                onClick={() => setActiveCategory("todos")}
                className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors cursor-pointer"
              >
                Ver Todos os Bolos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-6 sm:gap-x-7 pt-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </section>

        {/* Reviews & Social Proof */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Product Customization & Topo de Bolo Modal (Section 8) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseDetails}
      />

      {/* Shopping Cart Drawer (Section 10 - "Suas Escolhas") */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout & WhatsApp Order Submission Modal (Section 9) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Painel Passo a Passo de Encomenda Personalizada (Redondo vs Quadrado) */}
      {isOrderModalOpen && (
        <OrderModal
          order={customOrder}
          cakes={[...ROUND_CAKES, ...SQUARE_CAKES]}
          onClose={() => setIsOrderModalOpen(false)}
          onOrderChange={setCustomOrder}
          onOrderSubmitted={(data) => {
            setIsOrderModalOpen(false);
            setSubmittedOrder(data);
          }}
        />
      )}

      {/* Confirmação e Envio para WhatsApp */}
      {submittedOrder && (
        <OrderSuccessModal
          orderCode={submittedOrder.orderCode}
          customerName={submittedOrder.customerName}
          subtotal={submittedOrder.subtotal}
          downPayment={submittedOrder.downPayment}
          pickupDate={submittedOrder.pickupDate}
          whatsappMessage={submittedOrder.whatsappMessage}
          whatsappNumber={WHATSAPP_NUMBER}
          isChristmas={submittedOrder.isChristmas}
          onClose={() => setSubmittedOrder(null)}
        />
      )}

      {/* PWA Install Notification (Section 13) */}
      <PwaInstallBanner
        canInstallPrompt={canInstallPrompt}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR (Matching Reference Image Screens 1, 2, 3) */}
      <nav
        aria-label="Navegação do aplicativo"
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDD6FE] py-2 px-6 flex items-center justify-between shadow-2xl safe-bottom"
      >
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center space-y-1 text-[#6B7280] hover:text-[#8B5CF6] active:text-[#8B5CF6] font-semibold text-[10px] cursor-pointer"
        >
          <span className="text-lg leading-none">🏠</span>
          <span>Início</span>
        </button>

        <button
          onClick={scrollToCatalog}
          className="flex flex-col items-center space-y-1 text-[#8B5CF6] font-bold text-[10px] cursor-pointer"
        >
          <span className="text-lg leading-none">🎂</span>
          <span>Cardápio</span>
        </button>

        <button
          onClick={scrollToChristmas}
          className="flex flex-col items-center space-y-1 text-[#6B7280] hover:text-[#8B5CF6] active:text-[#8B5CF6] font-semibold text-[10px] cursor-pointer"
        >
          <span className="text-lg leading-none">🎄</span>
          <span>Natal</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center space-y-1 text-[#6B7280] hover:text-[#8B5CF6] font-semibold text-[10px]"
        >
          <div className="relative">
            <span className="text-lg leading-none">🛍️</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#8B5CF6] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span>Pedido</span>
        </button>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center space-y-1 text-emerald-600 font-semibold text-[10px]"
        >
          <span className="text-lg leading-none">💬</span>
          <span>WhatsApp</span>
        </a>
      </nav>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App;
