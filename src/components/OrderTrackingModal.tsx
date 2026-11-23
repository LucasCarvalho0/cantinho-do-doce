import React, { useState } from "react";
import { api } from "../api/client";
import { CloseIcon, SearchIcon } from "./Icons";
import { formatCurrency } from "../utils/whatsapp";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await api.trackOrder(code.trim());
      setOrder(res.order);
      setHistory(res.history || []);
    } catch (err: any) {
      setError(err.message || "Pedido não encontrado com este código.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "Aguardando análise": "bg-amber-100 text-amber-800 border-amber-200",
      "Aguardando confirmação": "bg-blue-100 text-blue-800 border-blue-200",
      Confirmado: "bg-purple-100 text-purple-800 border-purple-200",
      "Pagamento pendente": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Em produção": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Pronto para retirada": "bg-green-100 text-green-800 border-green-200",
      Finalizado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Cancelado: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
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

        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          Acompanhar Encomenda
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Digite o código que você recebeu ao solicitar seu bolo.
        </p>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: CD-2027-1234"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none uppercase font-mono tracking-wider text-gray-800 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center shadow-md"
            >
              {isLoading ? (
                "Buscando..."
              ) : (
                <>
                  <SearchIcon className="w-4 h-4 mr-1.5" /> Buscar
                </>
              )}
            </button>
          </div>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </form>

        {order && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm font-bold text-purple-900">
                  #{order.order_code}
                </span>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-base font-semibold text-gray-800">
                Cliente: {order.customer_name}
              </p>
              <div className="text-xs text-gray-600 mt-1 space-y-1">
                <p>
                  <strong>Data de Retirada:</strong>{" "}
                  {new Date(order.pickup_date + "T12:00:00").toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
                <p>
                  <strong>Bolo:</strong> {order.cake_cm}cm (
                  {order.cake_type === "round" ? "Redondo" : "Quadrado"})
                </p>
                <p>
                  <strong>Valor Final Confirmado:</strong>{" "}
                  {order.confirmed_price
                    ? formatCurrency(order.confirmed_price)
                    : formatCurrency(order.subtotal) + " (estimado)"}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Histórico de Atualizações
              </h4>
              <div className="space-y-2 border-l-2 border-purple-200 pl-4 ml-2">
                {history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600"></div>
                    <p className="text-xs font-bold text-gray-800">{h.new_status}</p>
                    <p className="text-xs text-gray-600">{h.note}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(h.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
