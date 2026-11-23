import React, { useState, useEffect } from "react";
import { AdminUser, DashboardMetrics, Cake, ConfectionerySettings } from "../../types";
import { api } from "../../api/client";
import { AdminOrderDetailsModal } from "./AdminOrderDetailsModal";
import { AdminCalendar } from "./AdminCalendar";
import { AdminProducts } from "./AdminProducts";
import { AdminSettings } from "./AdminSettings";
import {
  LogoutIcon,
  SearchIcon,
} from "../Icons";
import { formatCurrency } from "../../utils/whatsapp";

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onLogout,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "visao-geral" | "encomendas" | "calendario" | "produtos" | "configuracoes"
  >("visao-geral");

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [upcomingOrders, setUpcomingOrders] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Cake[]>([]);
  const [settings, setSettings] = useState<ConfectionerySettings>({});

  // Filter states for orders tab
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Selected order for modal details
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [mRes, oRes, pRes, sRes] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getOrders(statusFilter, searchTerm).catch(() => []),
        api.getAllProductsAdmin().catch(() => []),
        api.getSettings().catch(() => ({})),
      ]);

      if (mRes) {
        setMetrics(mRes.metrics);
        setUpcomingOrders(mRes.upcomingOrders || []);
      }
      setOrders(oRes || []);
      setProducts(pRes || []);
      setSettings(sRes || {});
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchTerm]);

  const handleOpenOrder = async (orderItem: any) => {
    try {
      const res = await api.getOrderDetails(orderItem.id);
      setSelectedOrder(res.order);
      setOrderHistory(res.history || []);
    } catch {
      setSelectedOrder(orderItem);
      setOrderHistory([]);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      "Aguardando análise": "bg-amber-100 text-amber-800 border-amber-200",
      "Aguardando confirmação": "bg-blue-100 text-blue-800 border-blue-200",
      Confirmado: "bg-purple-100 text-purple-800 border-purple-200",
      "Pagamento pendente": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Em produção": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Pronto para retirada": "bg-green-100 text-green-800 border-green-200",
      Finalizado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Cancelado: "bg-red-100 text-red-800 border-red-200",
    };
    return map[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <header className="bg-purple-950 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md border-b border-purple-900 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <img
            src="/images/logo-jana01.png"
            alt="Logo"
            className="w-9 h-9 rounded-full bg-white p-0.5"
          />
          <div>
            <h1 className="text-base sm:text-lg font-bold font-serif leading-none">
              Cantinho Doce — Gestão 2027
            </h1>
            <p className="text-[11px] text-purple-300">
              Conectada como: <strong>{user.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            Ver Site
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-600/80 hover:bg-red-600 text-white transition-colors"
          >
            <LogoutIcon className="w-3.5 h-3.5 mr-1" />
            Sair
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 flex-shrink-0 overflow-x-auto">
        <nav className="flex space-x-2 sm:space-x-6 min-w-max">
          {[
            { id: "visao-geral", label: "Visão Geral", icon: "📊" },
            { id: "encomendas", label: `Encomendas (${orders.length})`, icon: "🎂" },
            { id: "calendario", label: "Calendário de Produção", icon: "📅" },
            { id: "produtos", label: "Cardápio & Preços", icon: "🧁" },
            { id: "configuracoes", label: "Configurações", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? "border-purple-700 text-purple-800"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Tab Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "visao-geral" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase block">
                    Total Pedidos
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {metrics?.total || 0}
                  </span>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase block">
                    Aguardando Análise
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                    {metrics?.pendingAnalysis || 0}
                  </span>
                </div>

                <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-purple-800 uppercase block">
                    Confirmados
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-purple-900">
                    {metrics?.confirmed || 0}
                  </span>
                </div>

                <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-indigo-800 uppercase block">
                    Em Produção
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
                    {metrics?.inProduction || 0}
                  </span>
                </div>

                <div className="bg-green-50/70 p-4 rounded-2xl border border-green-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-green-800 uppercase block">
                    Prontos Retirada
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-green-900">
                    {metrics?.readyForPickup || 0}
                  </span>
                </div>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase block">
                    Finalizados
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                    {metrics?.finalized || 0}
                  </span>
                </div>
              </div>

              {/* Revenue Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-800 to-pink-700 text-white p-6 rounded-3xl shadow-md">
                  <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block mb-1">
                    Faturamento Confirmado
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold">
                    {formatCurrency(metrics?.totalRevenueConfirmed || 0)}
                  </span>
                  <p className="text-xs text-purple-200 mt-2">
                    Soma dos pedidos confirmados, em produção, prontos e finalizados.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Previsão Estimada (com pendentes)
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    {formatCurrency(metrics?.totalRevenueEstimated || 0)}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    Inclui solicitações que ainda aguardam aprovação de agenda.
                  </p>
                </div>
              </div>

              {/* Upcoming Orders (Next 7 Days) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold font-serif text-gray-900">
                    Próximas Retiradas Agendadas
                  </h3>
                  <button
                    onClick={() => setActiveTab("encomendas")}
                    className="text-xs font-bold text-purple-700 hover:underline"
                  >
                    Ver todas as encomendas →
                  </button>
                </div>

                {upcomingOrders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4">
                    Nenhuma encomenda agendada para os próximos dias no momento.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                          <th className="py-2.5">Código</th>
                          <th className="py-2.5">Cliente</th>
                          <th className="py-2.5">Data Retirada</th>
                          <th className="py-2.5">Bolo</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {upcomingOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-purple-50/30">
                            <td className="py-3 font-mono font-bold text-purple-900">
                              #{o.order_code}
                            </td>
                            <td className="py-3 font-semibold text-gray-900">
                              {o.customer_name}
                            </td>
                            <td className="py-3 text-purple-700 font-bold">
                              {new Date(o.pickup_date + "T12:00:00").toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="py-3 text-gray-600">
                              {o.cake_cm}cm ({o.cake_type === "round" ? "Redondo" : "Quadrado"})
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                                  o.status
                                )}`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleOpenOrder(o)}
                                className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200"
                              >
                                Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENCOMENDAS */}
          {activeTab === "encomendas" && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Filter & Search Bar */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-[280px]">
                  <div className="relative flex-1 max-w-sm">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por código, cliente ou WhatsApp..."
                      className="w-full px-3.5 py-2 pl-9 rounded-xl border border-gray-300 text-xs outline-none focus:border-purple-600"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white font-semibold outline-none focus:border-purple-600"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="Aguardando análise">Aguardando análise</option>
                    <option value="Aguardando confirmação">Aguardando confirmação</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pagamento pendente">Pagamento pendente</option>
                    <option value="Em produção">Em produção</option>
                    <option value="Pronto para retirada">Pronto para retirada</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <button
                  onClick={loadData}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Atualizar Lista
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    Nenhuma encomenda encontrada com estes filtros.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                          <th className="p-4">Código</th>
                          <th className="p-4">Cliente / Contato</th>
                          <th className="p-4">Retirada</th>
                          <th className="p-4">Bolo Solicitado</th>
                          <th className="p-4">Valor</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((o) => (
                          <tr
                            key={o.id}
                            className="hover:bg-purple-50/40 transition-colors cursor-pointer"
                            onClick={() => handleOpenOrder(o)}
                          >
                            <td className="p-4 font-mono font-bold text-purple-900">
                              #{o.order_code}
                              {o.is_christmas === 1 && (
                                <span className="ml-1 text-[10px] text-amber-700 bg-amber-100 px-1 rounded">
                                  🎄
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-gray-900">
                                {o.customer_name} {o.customer_surname}
                              </p>
                              <p className="text-[11px] text-gray-500">{o.customer_whatsapp}</p>
                            </td>
                            <td className="p-4 font-semibold text-gray-800">
                              {new Date(o.pickup_date + "T12:00:00").toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="p-4 text-gray-600">
                              {o.cake_cm}cm ({o.cake_type === "round" ? "Redondo" : "Quadrado"}) - {o.dough}
                            </td>
                            <td className="p-4 font-bold text-purple-700">
                              {formatCurrency(o.confirmed_price || o.subtotal)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                                  o.status
                                )}`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenOrder(o);
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-800 hover:bg-purple-200"
                              >
                                Gerenciar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CALENDÁRIO */}
          {activeTab === "calendario" && (
            <AdminCalendar orders={orders} onSelectOrder={handleOpenOrder} />
          )}

          {/* TAB 4: PRODUTOS */}
          {activeTab === "produtos" && (
            <AdminProducts products={products} onRefresh={loadData} />
          )}

          {/* TAB 5: CONFIGURAÇÕES */}
          {activeTab === "configuracoes" && (
            <AdminSettings settings={settings} onRefresh={loadData} />
          )}
        </div>
      </main>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          history={orderHistory}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={loadData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
