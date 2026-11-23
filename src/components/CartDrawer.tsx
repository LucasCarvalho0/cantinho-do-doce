import React from "react";
import { useCart } from "../context/CartContext.tsx";
import { formatCurrency } from "../utils/whatsapp.ts";
import { CloseIcon, TrashIcon } from "./Icons.tsx";

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, subtotal } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Suas Escolhas - Carrinho"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#FAFAFE] shadow-2xl flex flex-col justify-between border-l border-[#DDD6FE]">
          {/* Drawer Header (Matching Screen 3 "Your Choices") */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#DDD6FE] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider block">
                Itens Selecionados
              </span>
              <h3 className="text-xl font-bold font-serif text-[#1C1C2E]">
                Suas Escolhas
              </h3>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-[#7C3AED] rounded-full hover:bg-[#EDE9FE] transition-colors"
              aria-label="Fechar carrinho"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items List with Circular Cake Thumbnails */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 bg-[#EDE9FE] rounded-full flex items-center justify-center mx-auto text-4xl shadow-md border-2 border-white">
                  🎂
                </div>
                <h4 className="text-base font-bold text-[#1C1C2E]">
                  Seu carrinho está vazio
                </h4>
                <p className="text-xs text-[#6B7280] max-w-xs mx-auto leading-relaxed">
                  Explore nossos bolos artesanais, escolha seus sabores favoritos e monte sua comemoração!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-md shadow-[#8B5CF6]/25"
                >
                  Conhecer o Cardápio
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="bg-white p-4 rounded-3xl border border-[#DDD6FE] shadow-xs space-y-3 relative group"
                  >
                    <div className="flex items-start space-x-3.5">
                      {/* Round Cake Thumbnail on Plate (Matching Screen 3) */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-1 bg-white shadow-md border border-[#DDD6FE] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="w-12 h-2.5 bg-black/15 rounded-full blur-xs mx-auto -mt-1.5"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-[#1C1C2E] truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-md"
                            title="Remover item"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[11px] font-semibold text-[#8B5CF6]">
                          {item.customization.size.name} ({item.customization.size.slices})
                        </p>

                        <div className="text-[11px] text-[#6B7280] space-y-0.5 mt-1">
                          {item.customization.dough && (
                            <p>• Massa: {item.customization.dough}</p>
                          )}
                          {item.customization.fillings && item.customization.fillings.length > 0 && (
                            <p>• Recheio: {item.customization.fillings.join(" + ")}</p>
                          )}
                          {item.customization.topping && (
                            <p>• Cobertura: {item.customization.topping}</p>
                          )}
                          {item.customization.hasTopper && (
                            <p className="font-semibold text-[#8B5CF6]">
                              • Topo: Sim {item.customization.topperNotes ? `(${item.customization.topperNotes})` : ""}
                            </p>
                          )}
                          {item.customization.customText && (
                            <p className="font-semibold text-[#1C1C2E]">
                              • Frase: "{item.customization.customText}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reference & Topper Previews */}
                    {item.customization.topperImagePreview && (
                      <div className="flex items-center space-x-2 bg-[#F5F3FF] p-2 rounded-xl border border-[#C4B5FD]/40">
                        <img
                          src={item.customization.topperImagePreview}
                          alt="Foto do topo"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="text-[10px] text-[#4C1D95]">
                          <span className="font-bold text-[#5B21B6] block">Foto do Topo Anexada</span>
                          <span>Envie também na conversa do WhatsApp</span>
                        </div>
                      </div>
                    )}

                    {/* Item Footer: Quantity Stepper & Price (Matching Screen 3) */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#EDE9FE]">
                      <div className="flex items-center space-x-2 bg-[#F5F3FF] px-2.5 py-1 rounded-xl border border-[#DDD6FE]">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-5 h-5 rounded-full bg-white text-xs font-bold text-[#5B21B6] shadow-2xs hover:bg-[#EDE9FE] flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold text-[#1C1C2E] min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-white text-xs font-bold text-[#5B21B6] shadow-2xs hover:bg-[#EDE9FE] flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-extrabold text-[#1C1C2E]">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Button "Add More Item +" matching Screen 3 */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[#DDD6FE] hover:border-[#8B5CF6] text-xs font-bold text-[#5B21B6] hover:bg-white transition-all flex items-center justify-center space-x-1"
                >
                  <span>+ Adicionar mais bolos</span>
                </button>
              </>
            )}
          </div>

          {/* Drawer Footer: Subtotal & Checkout Button (Matching Screen 3) */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#DDD6FE] shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] block leading-none">
                    Subtotal
                  </span>
                  <span className="text-xl font-extrabold text-[#1C1C2E]">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {/* Checkout Button matching Screen 3 */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onProceedToCheckout();
                  }}
                  className="flex-1 py-3.5 px-6 rounded-full text-xs sm:text-sm font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center space-x-2"
                >
                  <span>Finalizar Pedido</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
