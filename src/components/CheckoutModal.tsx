import React, { useState } from "react";
import { useCart } from "../context/CartContext.tsx";
import { OrderCheckoutData } from "../types.ts";
import { formatCurrency, openCartWhatsApp } from "../utils/whatsapp.ts";
import { CloseIcon, WhatsAppIcon } from "./Icons.tsx";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, subtotal, clearCart } = useCart();

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const [formData, setFormData] = useState<OrderCheckoutData>({
    customerName: "",
    customerPhone: "",
    deliveryType: "retirada",
    address: "",
    pickupDate: minDateStr,
    timePeriod: "tarde",
    notes: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasReferenceImage = cart.some(
    (item) => item.customization.referenceImagePreview || item.customization.topperImagePreview
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.customerName.trim()) {
      setFormError("Por favor, informe seu nome.");
      return;
    }

    if (!formData.customerPhone.trim()) {
      setFormError("Por favor, informe seu número de WhatsApp.");
      return;
    }

    if (!formData.pickupDate) {
      setFormError("Por favor, selecione a data desejada.");
      return;
    }

    openCartWhatsApp(cart, formData, subtotal);
    clearCart();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-[#DDD6FE] my-4 sm:my-6 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#7C3AED] rounded-full hover:bg-[#EDE9FE] transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
            Etapa Final
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1C1C2E] font-serif">
            Revisão & Envio do Pedido
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Preencha seus dados para gerarmos a mensagem direta no WhatsApp da Janaína
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4 pb-2">
          {/* Order Summary Box */}
          <div className="bg-[#F5F3FF] p-4 rounded-2xl border border-[#DDD6FE] space-y-2 text-xs">
            <h4 className="font-bold text-[#1C1C2E] uppercase tracking-wider text-[11px]">
              Resumo do Pedido ({cart.length} {cart.length === 1 ? "item" : "itens"})
            </h4>
            <div className="divide-y divide-[#EDE9FE] space-y-2">
              {cart.map((item) => (
                <div key={item.cartId} className="pt-2 flex justify-between items-start">
                  <div>
                    <p className="font-bold text-[#1C1C2E]">
                      {item.quantity}x {item.name} ({item.customization.size.name})
                    </p>
                    {item.customization.dough && (
                      <p className="text-[11px] text-[#6B7280]">Massa: {item.customization.dough}</p>
                    )}
                    {item.customization.fillings && item.customization.fillings.length > 0 && (
                      <p className="text-[11px] text-[#6B7280]">
                        Recheio: {item.customization.fillings.join(" + ")}
                      </p>
                    )}
                    {item.customization.customText && (
                      <p className="text-[11px] font-semibold text-[#5B21B6]">
                        Texto: "{item.customization.customText}"
                      </p>
                    )}
                    {item.customization.hasTopper && (
                      <p className="text-[11px] font-semibold text-[#8B5CF6]">
                        Topo de Bolo: Sim {item.customization.topperNotes ? `(${item.customization.topperNotes})` : ""}
                      </p>
                    )}
                  </div>
                  <span className="font-extrabold text-[#1C1C2E]">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#DDD6FE] flex justify-between text-sm font-extrabold text-[#1C1C2E]">
              <span>Subtotal do Pedido:</span>
              <span className="text-[#8B5CF6]">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          {/* Form Fields: Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C2E]">
              Seus Dados para Contato
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Ex: Mariana Silva"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Seu WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="(24) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>
            </div>

            {/* Modalidade de Atendimento: Exclusivo Retirada no Local */}
            <div>
              <label className="block text-xs font-bold text-[#1C1C2E] mb-1.5">
                Modalidade de Atendimento *
              </label>
              <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-[#8B5CF6] bg-[#F5F3FF] flex items-start space-x-3 shadow-xs">
                <span className="text-xl sm:text-2xl flex-shrink-0">📍</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1C1C2E]">
                      Retirada no Local (Exclusiva)
                    </span>
                    <span className="text-[10px] font-bold text-[#8B5CF6] bg-white px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                      Cidade Jardim
                    </span>
                  </div>
                  <p className="text-xs text-[#5B21B6] font-medium mt-0.5">
                    Rua Quatorze, 34 — Cidade Jardim Itatiaia, Itatiaia - RJ
                  </p>
                  <p className="text-[11px] text-[#7C6FAD] mt-1.5 leading-relaxed">
                    ⚠️ <em>Trabalhamos exclusivamente com retirada no local para garantir o frescor, a estrutura e a decoração perfeita do seu bolo. Não realizamos entregas.</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Date and Time Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Data Desejada *
                </label>
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={formData.pickupDate}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupDate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Período de Preferência
                </label>
                <select
                  value={formData.timePeriod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timePeriod: e.target.value as "manha" | "tarde",
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs bg-white outline-none focus:border-[#8B5CF6]"
                >
                  <option value="manha">Manhã (09h às 12h)</option>
                  <option value="tarde">Tarde (14h às 18h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                Observações Adicionais para a Janaína
              </label>
              <textarea
                rows={2}
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Ex: Prefiro retirar por volta das 15h30, preciso de embalagem para viagem..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] text-xs outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Reference Image Mandatory Reminder */}
          {hasReferenceImage && (
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-800 leading-relaxed">
              <p className="font-bold flex items-center mb-1">
                <span className="text-base mr-1.5">📸</span> ATENÇÃO SOBRE A SUA FOTO DE REFERÊNCIA:
              </p>
              O WhatsApp não consegue anexar automaticamente arquivos selecionados na web.{" "}
              <strong>
                Ao clicar no botão abaixo e abrir a conversa no WhatsApp, lembre-se de enviar a sua foto de referência diretamente para a Janaína.
              </strong>
            </div>
          )}

          {/* Non-Confirmation Disclaimer */}
          <div className="bg-[#F5F3FF] border border-[#DDD6FE] p-3 rounded-2xl text-[11px] text-[#6B7280] leading-relaxed">
            <p className="font-bold text-[#1C1C2E] mb-0.5">
              ℹ️ Como funciona a confirmação da sua encomenda:
            </p>
            O envio via WhatsApp representa uma <strong>solicitação de encomenda</strong>. A Janaína Mendes irá analisar a disponibilidade da agenda para a data escolhida, combinar os detalhes da decoração e formalizar a confirmação do seu bolo.
          </div>

          {formError && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              {formError}
            </p>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#DDD6FE] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#7C6FAD] hover:text-[#1C1C2E] border border-[#DDD6FE] hover:bg-[#F5F3FF] transition-colors text-center"
            >
              Voltar ao Carrinho
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <WhatsAppIcon className="w-5 h-5 mr-1" />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
