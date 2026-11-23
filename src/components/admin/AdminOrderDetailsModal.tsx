import React, { useState } from "react";
import { OrderStatus } from "../../types";
import { api } from "../../api/client";
import { CloseIcon, WhatsAppIcon } from "../Icons";
import { formatCurrency, openWhatsApp } from "../../utils/whatsapp";

interface AdminOrderDetailsModalProps {
  order: any;
  history: any[];
  onClose: () => void;
  onOrderUpdated: () => void;
}

const ALL_STATUSES: OrderStatus[] = [
  "Aguardando análise",
  "Aguardando confirmação",
  "Confirmado",
  "Pagamento pendente",
  "Em produção",
  "Pronto para retirada",
  "Finalizado",
  "Cancelado",
];

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  history,
  onClose,
  onOrderUpdated,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [confirmedPrice, setConfirmedPrice] = useState(
    order.confirmed_price !== null && order.confirmed_price !== undefined
      ? String(order.confirmed_price)
      : String(order.subtotal)
  );
  const [paymentMethod, setPaymentMethod] = useState(order.payment_method || "PIX");
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || "");
  const [statusNote, setStatusNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  let fillingsArray: string[] = [];
  try {
    fillingsArray = JSON.parse(order.fillings || "[]");
  } catch {}

  let optionalsArray: any[] = [];
  try {
    optionalsArray = JSON.parse(order.optionals || "[]");
  } catch {}

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await api.updateOrderStatus(order.id, {
        status: selectedStatus,
        confirmedPrice: Number(confirmedPrice),
        paymentMethod,
        adminNotes,
        note: statusNote.trim() || undefined,
      });

      setSaveMessage("Pedido atualizado com sucesso!");
      setTimeout(() => {
        onOrderUpdated();
        onClose();
      }, 1000);
    } catch (err: any) {
      setSaveMessage(`Erro: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickWhatsApp = () => {
    const text = `Olá, ${order.customer_name}! Aqui é a Janaína do Cantinho Doce sobre o seu pedido #${order.order_code}. `;
    openWhatsApp(text, order.customer_whatsapp);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8 max-h-[92vh] flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-purple-900">
                #{order.order_code}
              </span>
              {order.is_christmas === 1 && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  🎄 Natal
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Registrado em: {new Date(order.created_at).toLocaleString("pt-BR")}
            </p>
          </div>

          <button
            onClick={handleQuickWhatsApp}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-sm"
          >
            <WhatsAppIcon className="w-4 h-4 mr-1.5" />
            Conversar com Cliente
          </button>
        </div>

        {/* Content Tabs / Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Section: Customer & Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Dados do Cliente
              </h4>
              <p className="text-sm font-bold text-gray-900">
                {order.customer_name} {order.customer_surname}
              </p>
              <p className="text-xs text-gray-600">WhatsApp: {order.customer_whatsapp}</p>
              <p className="text-xs text-gray-600">
                Data Desejada:{" "}
                <strong className="text-purple-700">
                  {new Date(order.pickup_date + "T12:00:00").toLocaleDateString("pt-BR")}
                </strong>
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Especificação do Evento
              </h4>
              <p className="text-xs text-gray-600">
                <strong>Ocasião:</strong> {order.event_type || "Não informada"}
              </p>
              <p className="text-xs text-gray-600">
                <strong>Topo de Bolo:</strong> {order.has_topper === "sim" ? "✅ Sim" : "❌ Não"}
              </p>
              {order.theme_description && (
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Tema/Cores:</strong> {order.theme_description}
                </p>
              )}
            </div>
          </div>

          {/* Section: Cake Specifications */}
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2">
              Detalhes do Bolo
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block">Tamanho:</span>
                <span className="font-bold text-gray-900">
                  {order.cake_cm}cm ({order.cake_type === "round" ? "Redondo" : "Quadrado"})
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Rendimento:</span>
                <span className="font-bold text-gray-900">{order.cake_slices}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Massa:</span>
                <span className="font-bold text-gray-900">{order.dough}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Cobertura:</span>
                <span className="font-bold text-gray-900">{order.topping}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-purple-200/60 text-xs">
              <p>
                <strong>Recheios:</strong>{" "}
                {fillingsArray.length > 0 ? fillingsArray.join(" + ") : "A combinar"}
              </p>
              {optionalsArray.length > 0 && (
                <p className="mt-1">
                  <strong>Opcionais:</strong>{" "}
                  {optionalsArray.map((o) => `${o.name} (${formatCurrency(o.price)})`).join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Section: Administrative Management */}
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Gerenciar Status e Valores
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Status Atual
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white outline-none focus:border-purple-600"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Valor Final Confirmado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={confirmedPrice}
                  onChange={(e) => setConfirmedPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white outline-none focus:border-purple-600"
                >
                  <option value="PIX">PIX</option>
                  <option value="PIX (Entrada 50%)">PIX (Entrada 50%)</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="A combinar na retirada">A combinar na retirada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nota da Alteração de Status (fica salva no histórico do cliente)
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Ex: Pagamento da entrada confirmado via PIX."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Observações Internas Administrativas (visível apenas para você)
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Ex: Cliente prefere flores lilases claras, retirar às 14h."
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
              />
            </div>
          </div>

          {/* Section: Chronological History */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Histórico de Alterações do Pedido
            </h4>
            <div className="space-y-2 border-l-2 border-purple-200 pl-4 ml-1">
              {history.map((h, i) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-gray-800">
                    {h.new_status}{" "}
                    <span className="text-[10px] font-normal text-gray-400">
                      ({new Date(h.created_at).toLocaleString("pt-BR")})
                    </span>
                  </p>
                  <p className="text-gray-600">{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          {saveMessage && (
            <span className="text-xs font-bold text-purple-700">{saveMessage}</span>
          )}
          <div className="ml-auto flex space-x-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-700 transition-all shadow-md"
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
