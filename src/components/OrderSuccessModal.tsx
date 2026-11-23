import React from "react";
import { CheckCircleIcon, WhatsAppIcon, CloseIcon } from "./Icons";
import { formatCurrency, openWhatsApp } from "../utils/whatsapp";

interface OrderSuccessModalProps {
  orderCode: string;
  customerName: string;
  subtotal: number;
  downPayment?: number;
  pickupDate: string;
  whatsappMessage: string;
  whatsappNumber?: string;
  isChristmas?: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orderCode,
  customerName,
  subtotal,
  downPayment,
  pickupDate,
  whatsappMessage,
  whatsappNumber,
  isChristmas,
  onClose,
}) => {
  const handleSendWhatsApp = () => {
    openWhatsApp(whatsappMessage, whatsappNumber);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
            <CheckCircleIcon className="w-10 h-10" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Solicitação Registrada!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Obrigado, <strong className="text-purple-700">{customerName}</strong>!
          </p>
        </div>

        {/* Order Code Badge */}
        <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/80 text-center mb-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-purple-600 mb-1">
            Código da sua Encomenda
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-900 tracking-wider font-mono">
            #{orderCode}
          </p>
          <p className="text-xs text-purple-700/80 mt-1">
            Guarde este código para acompanhar o status do seu pedido a qualquer momento.
          </p>
        </div>

        {/* Summary Info */}
        <div className="space-y-2.5 text-sm bg-gray-50 p-4 rounded-xl mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Data de Retirada Desejada:</span>
            <span className="font-semibold text-gray-900">
              {new Date(pickupDate + "T12:00:00").toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Valor Estimado:</span>
            <span className="font-semibold text-purple-700">{formatCurrency(subtotal)}</span>
          </div>
          {isChristmas && downPayment ? (
            <div className="flex justify-between text-amber-700 pt-2 border-t border-gray-200">
              <span>Sinal de Reserva (50%):</span>
              <span className="font-bold">{formatCurrency(downPayment)}</span>
            </div>
          ) : null}
        </div>

        {/* Important Warning: Pending Approval */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800 leading-relaxed">
          <p className="font-bold flex items-center mb-1">
            <span className="mr-1 text-sm">⚠️</span> ATENÇÃO: PEDIDO AGUARDANDO CONFIRMAÇÃO
          </p>
          Sua solicitação foi registrada em nosso sistema, mas a encomenda <strong>só é confirmada após a aprovação da Janaína</strong> (verificação de disponibilidade de agenda, personalizações e combinação do pagamento).
        </div>

        {/* WhatsApp Call to Action */}
        <div className="space-y-3">
          <button
            onClick={handleSendWhatsApp}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-base"
          >
            <WhatsAppIcon className="w-6 h-6 mr-2" />
            Enviar Pedido pelo WhatsApp
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-semibold text-gray-600 hover:text-purple-700 transition-colors"
          >
            Fechar e Voltar ao Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
