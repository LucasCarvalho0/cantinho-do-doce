import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";

interface AdminCalendarProps {
  orders: any[];
  onSelectOrder: (order: any) => void;
}

export const AdminCalendar: React.FC<AdminCalendarProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayOrders, setSelectedDayOrders] = useState<any[] | null>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayOrders(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayOrders(null);
  };

  // Group orders by pickup_date YYYY-MM-DD
  const ordersMap: Record<string, any[]> = {};
  for (const o of orders) {
    if (o.pickup_date) {
      if (!ordersMap[o.pickup_date]) ordersMap[o.pickup_date] = [];
      ordersMap[o.pickup_date].push(o);
    }
  }

  // Days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const handleDayClick = (dayStr: string) => {
    const list = ordersMap[dayStr] || [];
    setSelectedDayOrders(list);
    setSelectedDateStr(dayStr);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-gray-900">
              Calendário de Encomendas & Produção
            </h3>
            <p className="text-xs text-gray-500">
              Acompanhe o volume de bolos agendados para cada dia
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-purple-50 text-gray-700"
              aria-label="Mês anterior"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-purple-900 px-3">
              {monthNames[month]} de {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-purple-50 text-gray-700"
              aria-label="Próximo mês"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
          <span>Dom</span>
          <span>Seg</span>
          <span>Ter</span>
          <span>Qua</span>
          <span>Qui</span>
          <span>Sex</span>
          <span>Sáb</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 sm:h-20 bg-gray-50/50 rounded-2xl" />
          ))}

          {/* Days */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
              dayNum
            ).padStart(2, "0")}`;
            const dayOrders = ordersMap[dateStr] || [];
            const count = dayOrders.length;
            const isSelected = selectedDateStr === dateStr;

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => handleDayClick(dateStr)}
                className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-300"
                    : count > 0
                    ? "border-purple-200 bg-purple-50/40 hover:bg-purple-50"
                    : "border-gray-100 hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-bold ${
                      count > 0 ? "text-purple-900" : "text-gray-700"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {count > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-600 text-white">
                      {count}
                    </span>
                  )}
                </div>

                {count > 0 && (
                  <div className="flex space-x-0.5 overflow-hidden">
                    {dayOrders.slice(0, 3).map((o, idx) => (
                      <span
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          o.status === "Finalizado"
                            ? "bg-green-500"
                            : o.status === "Em produção"
                            ? "bg-indigo-500"
                            : o.status === "Confirmado"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                        }`}
                        title={`${o.customer_name} - ${o.cake_cm}cm`}
                      />
                    ))}
                    {count > 3 && (
                      <span className="text-[9px] text-purple-700 font-bold">+{count - 3}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Orders Drawer / Card */}
      {selectedDayOrders && selectedDateStr && (
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-bold text-gray-900">
              Encomendas para {new Date(selectedDateStr + "T12:00:00").toLocaleDateString("pt-BR")}{" "}
              ({selectedDayOrders.length})
            </h4>
            <button
              onClick={() => setSelectedDayOrders(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Fechar
            </button>
          </div>

          {selectedDayOrders.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum pedido agendado para esta data.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedDayOrders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => onSelectOrder(o)}
                  className="p-3.5 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-purple-50/30"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-purple-900">
                      #{o.order_code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{o.customer_name}</p>
                  <p className="text-[11px] text-gray-600">
                    Bolo {o.cake_cm}cm ({o.cake_type === "round" ? "Redondo" : "Quadrado"})
                  </p>
                  <p className="text-[11px] text-purple-700 font-bold mt-1">
                    R$ {Number(o.confirmed_price || o.subtotal).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
