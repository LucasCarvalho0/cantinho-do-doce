import React, { useState, useCallback, useMemo } from "react";
import { Order, Optional, Cake } from "../types";
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "./Icons";
import {
  ROUND_CAKES,
  SQUARE_CAKES,
  DOUGHS,
  FILLINGS,
  TOPPINGS,
  OPTIONALS,
  EVENT_TYPES,
} from "../constants";
import { formatCurrency, generateWhatsAppMessage } from "../utils/whatsapp";
import { api } from "../api/client";

interface OrderModalProps {
  order: Order;
  cakes: Cake[];
  onClose: () => void;
  onOrderChange: (order: Order) => void;
  onOrderSubmitted: (data: {
    orderCode: string;
    customerName: string;
    subtotal: number;
    downPayment?: number;
    pickupDate: string;
    whatsappMessage: string;
    isChristmas: boolean;
    topperImagePreview?: string;
    topperImageName?: string;
  }) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  cakes,
  onClose,
  onOrderChange,
  onOrderSubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShape, setSelectedShape] = useState<"round" | "square">(
    order.size?.type === "square" ? "square" : "round"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [topperFileError, setTopperFileError] = useState<string | null>(null);

  const totalSteps = 6;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleShapeChange = (shape: "round" | "square") => {
    setSelectedShape(shape);
    if (order.size && order.size.type !== shape) {
      onOrderChange({ ...order, size: null });
    }
  };

  const handleSelectCake = (cake: Cake) => {
    onOrderChange({ ...order, size: cake });
  };

  const handleSelectDough = (dough: "Branca" | "Chocolate") => {
    onOrderChange({ ...order, dough });
  };

  const handleTopperFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setTopperFileError(null);
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setTopperFileError("Formato inválido. Selecione uma imagem JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTopperFileError("Imagem muito pesada. O tamanho máximo permitido é 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      onOrderChange({
        ...order,
        customer: {
          ...order.customer,
          topperImageName: file.name,
          topperImagePreview: event.target?.result as string,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTopperImage = () => {
    setTopperFileError(null);
    onOrderChange({
      ...order,
      customer: {
        ...order.customer,
        topperImageName: undefined,
        topperImagePreview: undefined,
      },
    });
  };

  const handleSelectFilling = (filling: string) => {
    const newFillings = order.fillings.includes(filling)
      ? order.fillings.filter((f) => f !== filling)
      : [...order.fillings, filling];

    if (newFillings.length <= 2) {
      onOrderChange({ ...order, fillings: newFillings });
    }
  };

  const handleSelectTopping = (topping: string) => {
    onOrderChange({ ...order, topping });
  };

  const handleSelectOptional = (optional: Optional) => {
    const newOptionals = order.optionals.some((o) => o.name === optional.name)
      ? order.optionals.filter((o) => o.name !== optional.name)
      : [...order.optionals, optional];
    onOrderChange({ ...order, optionals: newOptionals });
  };

  const subtotal = useMemo(() => {
    if (!order.size) return 0;
    return (
      order.size.price +
      order.optionals.reduce((sum, opt) => sum + opt.price, 0)
    );
  }, [order.size, order.optionals]);

  const downPayment = useMemo(() => {
    return order.isChristmasOrder ? subtotal * 0.5 : 0;
  }, [order.isChristmasOrder, subtotal]);

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !order.size || order.size.type !== selectedShape;
      case 2:
        return !order.dough;
      case 3:
        return order.fillings.length === 0;
      case 4:
        return !order.topping;
      case 5:
        const { name, whatsapp, pickupDate } = order.customer;
        return !name.trim() || !whatsapp.trim() || !pickupDate;
      case 6:
        return false;
      default:
        return true;
    }
  }, [currentStep, order, selectedShape]);

  // Handle final submission to WhatsApp and order registration
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const fallbackCode = `CD-2027-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await api.createOrder({
        ...order,
        subtotal,
      });

      const orderCode = res?.orderCode || fallbackCode;
      const downPaymentVal = res?.downPayment ?? downPayment;
      const message = generateWhatsAppMessage(order, undefined, orderCode);

      onOrderSubmitted({
        orderCode,
        customerName: `${order.customer.name} ${order.customer.surname}`.trim(),
        subtotal,
        downPayment: downPaymentVal,
        pickupDate: order.customer.pickupDate,
        whatsappMessage: message,
        isChristmas: order.isChristmasOrder,
        topperImagePreview: order.customer.topperImagePreview,
        topperImageName: order.customer.topperImageName,
      });
    } catch (err: any) {
      console.warn("API request error, proceeding with instant WhatsApp flow:", err);
      // Fail-safe: NEVER block customer from completing their order on WhatsApp
      const message = generateWhatsAppMessage(order, undefined, fallbackCode);

      onOrderSubmitted({
        orderCode: fallbackCode,
        customerName: `${order.customer.name} ${order.customer.surname}`.trim(),
        subtotal,
        downPayment,
        pickupDate: order.customer.pickupDate,
        whatsappMessage: message,
        isChristmas: order.isChristmasOrder,
        topperImagePreview: order.customer.topperImagePreview,
        topperImageName: order.customer.topperImageName,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    order.isChristmasOrder ? "Tamanho do Bolo de Natal" : "Escolha o Formato e Tamanho",
    "Escolha a Massa",
    "Escolha até 2 Recheios",
    "Cobertura e Opcionais",
    "Dados da Retirada e Evento",
    "Revisão da Solicitação",
  ];

  // Minimum date for pickup: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const availableCakes = useMemo(() => {
    if (order.isChristmasOrder) {
      const xmas = cakes.filter((c) => c.is_christmas === 1);
      return xmas.length > 0 ? xmas : cakes;
    }
    const source = cakes && cakes.length > 0 ? cakes : [...ROUND_CAKES, ...SQUARE_CAKES];
    return source.filter((c) => !c.is_christmas && c.type === selectedShape);
  }, [cakes, order.isChristmasOrder, selectedShape]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2.5 sm:p-4 overflow-y-auto overflow-x-hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl border border-[#DDD6FE] my-auto max-h-[92vh] flex flex-col justify-between overflow-hidden box-border">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Modal Header & Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Passo {currentStep} de {totalSteps}
            </span>
            {order.isChristmasOrder && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                🎄 Encomenda de Natal
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
            {stepTitles[currentStep - 1]}
          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modal Body / Step Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 mb-4 scrollbar-thin">
          {/* STEP 1: CAKE FORMAT & SIZE SELECTOR */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B7280]">
                Escolha primeiro o formato desejado (<strong>Bolo Redondo</strong> ou <strong>Bolo Quadrado</strong>) para visualizar os tamanhos, quantidades de fatias e valores:
              </p>

              {/* Duas Opções de Formato: Redondo vs Quadrado */}
              <div className="grid grid-cols-2 p-1.5 bg-[#F5F3FF] rounded-2xl border border-[#DDD6FE] gap-2">
                <button
                  type="button"
                  onClick={() => handleShapeChange("round")}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer ${
                    selectedShape === "round"
                      ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 scale-[1.02]"
                      : "text-[#6B7280] hover:text-[#1C1C2E] hover:bg-white/70"
                  }`}
                >
                  <span className="text-lg">⭕</span>
                  <span>Bolo Redondo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShapeChange("square")}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer ${
                    selectedShape === "square"
                      ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 scale-[1.02]"
                      : "text-[#6B7280] hover:text-[#1C1C2E] hover:bg-white/70"
                  }`}
                >
                  <span className="text-lg">⬛</span>
                  <span>Bolo Quadrado</span>
                </button>
              </div>

              {/* Subtítulo informativo */}
              <div className="flex items-center justify-between text-xs text-[#7C6FAD] px-1">
                <span>
                  Opções de <strong>{selectedShape === "round" ? "Bolo Redondo" : "Bolo Quadrado"}</strong>:
                </span>
                <span className="font-semibold text-[#8B5CF6]">
                  {availableCakes.length} tamanhos disponíveis
                </span>
              </div>

              {/* Lista dos tamanhos com rendimento (fatias) e valor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableCakes.map((c, i) => {
                  const isSelected =
                    order.size?.cm === c.cm && order.size?.type === c.type;
                  return (
                    <div
                      key={`step1-${c.type}-${c.cm}-${i}`}
                      onClick={() => handleSelectCake(c)}
                      className={`p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center space-x-3.5 transform hover:scale-[1.01] ${
                        isSelected
                          ? "border-[#8B5CF6] bg-[#EDE9FE]/70 shadow-md ring-2 ring-[#8B5CF6]/20"
                          : "border-[#DDD6FE]/70 hover:border-[#8B5CF6]/50 bg-white"
                      }`}
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shadow-xs border border-[#DDD6FE] flex-shrink-0">
                        <img
                          src={c.image}
                          alt={`Bolo ${c.cm}cm`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/hero01.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-[#1C1C2E] truncate">
                          {selectedShape === "round"
                            ? `Bolo ${c.cm}cm (Redondo)`
                            : `Bolo ${c.cm}x${c.cm}cm (Quadrado)`}
                        </p>
                        <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                          <span>👥</span>
                          <span>Rendimento: <strong>{c.slices}</strong></span>
                        </p>
                        <p className="text-sm font-extrabold text-[#7C3AED] mt-1">
                          {formatCurrency(c.price)}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <CheckCircleIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: DOUGH */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B7280]">
                Todas as nossas massas são fofinhas, leves e preparadas de forma 100% artesanal:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                {DOUGHS.map((dough) => {
                  const isSelected = order.dough === dough;
                  return (
                    <div
                      key={dough}
                      onClick={() => handleSelectDough(dough as any)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-center box-border ${
                        isSelected
                          ? "border-[#8B5CF6] bg-[#EDE9FE]/80 shadow-md ring-2 ring-[#8B5CF6]/20"
                          : "border-[#DDD6FE] hover:border-[#8B5CF6]/50 bg-white"
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl mb-2">
                        {dough === "Chocolate" ? "🍫" : "🌾"}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#1C1C2E]">
                        Massa {dough}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                        {dough === "Chocolate"
                          ? "Com cacau nobre, textura aveludada e sabor marcante."
                          : "Massa branca clássica de baunilha, fofa e molhadinha."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FILLINGS */}
          {currentStep === 3 && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#F5F3FF] p-3 sm:p-3.5 rounded-2xl border border-[#DDD6FE]">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C1C2E]">
                    Recheios Artesanais
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Escolha <strong>1 ou 2 recheios</strong> para compor o sabor:
                  </p>
                </div>
                <div className="flex-shrink-0 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center text-xs font-extrabold px-3 py-1 rounded-full whitespace-nowrap shadow-xs transition-colors ${
                      order.fillings.length > 0
                        ? "bg-[#8B5CF6] text-white"
                        : "bg-white text-[#7C3AED] border border-[#DDD6FE]"
                    }`}
                  >
                    {order.fillings.length} de 2 selecionados
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {FILLINGS.map((filling) => {
                  const isSelected = order.fillings.includes(filling);
                  return (
                    <button
                      key={filling}
                      type="button"
                      onClick={() => handleSelectFilling(filling)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                          : "border-gray-200 hover:border-purple-300 text-gray-700 bg-white"
                      }`}
                    >
                      <span>{filling}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TOPPING & OPTIONALS */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Cobertura Principal:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TOPPINGS.map((topping) => {
                    const isSelected = order.topping === topping;
                    return (
                      <button
                        key={topping}
                        type="button"
                        onClick={() => handleSelectTopping(topping)}
                        className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50 text-purple-900 shadow-sm font-bold"
                            : "border-gray-200 hover:border-purple-200 text-gray-700 bg-white"
                        }`}
                      >
                        {topping}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Opcionais & Adicionais Especiais (opcional):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {OPTIONALS.map((opt) => {
                    const isSelected = order.optionals.some(
                      (o) => o.name === opt.name
                    );
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => handleSelectOptional(opt)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-pink-500 bg-pink-50 text-pink-900 font-semibold"
                            : "border-gray-200 hover:border-pink-200 text-gray-700 bg-white"
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] font-bold text-purple-700 mt-1">
                          +{formatCurrency(opt.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: EVENT & CUSTOMER CONTACT */}
          {currentStep === 5 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={order.customer.name}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: { ...order.customer, name: e.target.value },
                      })
                    }
                    placeholder="Nome"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={order.customer.surname}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: { ...order.customer, surname: e.target.value },
                      })
                    }
                    placeholder="Sobrenome"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Seu WhatsApp para Contato *
                  </label>
                  <input
                    type="tel"
                    required
                    value={order.customer.whatsapp}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: { ...order.customer, whatsapp: e.target.value },
                      })
                    }
                    placeholder="(24) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm"
                  />
                </div>

                <div className="bg-[#FAF5FF] p-3 sm:p-3.5 rounded-2xl border-2 border-[#8B5CF6]/50 hover:border-[#8B5CF6] transition-all shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-[#5B21B6] flex items-center space-x-1.5 cursor-pointer">
                      <span>📅</span>
                      <span>Data Desejada de Retirada *</span>
                    </label>
                    <span className="text-[10px] font-bold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                      Obrigatório
                    </span>
                  </div>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={order.customer.pickupDate}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: {
                          ...order.customer,
                          pickupDate: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#8B5CF6] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#8B5CF6]/30 outline-none text-sm font-bold text-[#1C1C2E] bg-white cursor-pointer shadow-2xs"
                  />
                  <p className="text-[11px] text-[#7C3AED] mt-1.5 font-medium flex items-center space-x-1">
                    <span>👉</span>
                    <span>Toque no campo para escolher o dia da retirada (a partir de amanhã)</span>
                  </p>
                  {order.customer.pickupDate && (
                    <div className="mt-2 py-1 px-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center space-x-1">
                      <span>✓</span>
                      <span>
                        Retirada agendada para:{" "}
                        {new Date(order.customer.pickupDate + "T12:00:00").toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ocasião / Tipo de Evento
                  </label>
                  <select
                    value={order.customer.eventType || "Outros"}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: {
                          ...order.customer,
                          eventType: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-200 outline-none text-sm bg-white"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                    Deseja Topo de Bolo Personalizado?
                  </label>
                  <select
                    value={order.customer.hasTopper || "não"}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: {
                          ...order.customer,
                          hasTopper: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 outline-none text-xs sm:text-sm bg-white"
                  >
                    <option value="não">Não, sem topo</option>
                    <option value="sim">Sim, desejo topo com nome/tema</option>
                  </select>
                </div>
              </div>

              {/* UPLOAD & PERSONALIZAÇÃO DO TOPO DE BOLO QUANDO ESCOLHE "SIM" */}
              {order.customer.hasTopper === "sim" && (
                <div className="bg-[#F5F3FF] p-3.5 sm:p-4 rounded-2xl border border-[#DDD6FE] space-y-3 animate-fade-in-up">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#8B5CF6]">
                    <span>🎂</span>
                    <span>Personalização do Topo de Bolo</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1C2E] mb-1">
                      Detalhes do Topo (Nome, Idade ou Frase):
                    </label>
                    <input
                      type="text"
                      value={order.customer.topperNotes || ""}
                      onChange={(e) =>
                        onOrderChange({
                          ...order,
                          customer: {
                            ...order.customer,
                            topperNotes: e.target.value,
                          },
                        })
                      }
                      placeholder="Ex: Nome: Sofia, 7 anos — Cores: Lilás e Dourado"
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] bg-white text-xs outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C1C2E] mb-1">
                      Foto / Modelo de Inspiração do Topo:
                    </label>

                    {!order.customer.topperImagePreview ? (
                      <label className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-[#DDD6FE] hover:border-[#8B5CF6] bg-white cursor-pointer transition-colors text-center">
                        <span className="text-2xl mb-1">📸</span>
                        <span className="text-xs font-bold text-[#8B5CF6]">
                          Clique para anexar foto do topo desejado
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] mt-0.5">
                          Envie um print ou foto (JPG, PNG ou WEBP até 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleTopperFileChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#DDD6FE] bg-white">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <img
                            src={order.customer.topperImagePreview}
                            alt="Prévia do Topo"
                            className="w-12 h-12 rounded-lg object-cover border border-[#DDD6FE] flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1C1C2E] truncate">
                              {order.customer.topperImageName || "Imagem do Topo"}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-semibold">
                              ✓ Foto anexada com sucesso
                            </p>
                            <label className="text-[11px] text-[#8B5CF6] font-bold hover:underline cursor-pointer">
                              Substituir foto
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleTopperFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveTopperImage}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 text-xs ml-2 flex-shrink-0"
                          title="Remover foto"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {topperFileError && (
                      <p className="text-xs text-red-600 font-bold mt-1 bg-red-50 p-1.5 rounded-lg border border-red-200">
                        {topperFileError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1C1C2E] mb-1">
                  Descrição do Tema, Cores ou Observações
                </label>
                <textarea
                  rows={2}
                  value={order.customer.themeDescription || ""}
                  onChange={(e) =>
                    onOrderChange({
                      ...order,
                      customer: {
                        ...order.customer,
                        themeDescription: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: Tema safari infantil, detalhes em tons de lilás, laço rosa, etc."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DDD6FE] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30 outline-none text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 6: SUMMARY & SUBMISSION */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200/80 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between pb-2 border-b border-purple-200">
                  <span className="text-gray-600 font-medium">Bolo Escolhido:</span>
                  <span className="font-bold text-gray-900">
                    {order.size?.cm}cm ({order.size?.type === "round" ? "Redondo" : "Quadrado"}) - {order.size?.slices}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Massa:</span>
                  <span className="font-semibold text-gray-900">{order.dough}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recheios:</span>
                  <span className="font-semibold text-gray-900">
                    {order.fillings.length > 0 ? order.fillings.join(" + ") : "A combinar"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cobertura:</span>
                  <span className="font-semibold text-gray-900">{order.topping}</span>
                </div>
                {order.optionals.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Opcionais:</span>
                    <span className="font-semibold text-gray-900">
                      {order.optionals.map((o) => o.name).join(", ")}
                    </span>
                  </div>
                )}
                {order.customer.hasTopper === "sim" && (
                  <div className="flex justify-between items-start pt-1 border-t border-purple-100">
                    <span className="text-gray-600">Topo de Bolo:</span>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900 block">
                        Sim (Personalizado)
                      </span>
                      {order.customer.topperNotes && (
                        <span className="text-xs text-[#8B5CF6] block font-medium">
                          {order.customer.topperNotes}
                        </span>
                      )}
                      {order.customer.topperImageName && (
                        <div className="flex items-center justify-end space-x-1.5 mt-1">
                          {order.customer.topperImagePreview && (
                            <img
                              src={order.customer.topperImagePreview}
                              alt="Topo"
                              className="w-7 h-7 rounded-md object-cover border border-[#DDD6FE]"
                            />
                          )}
                          <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-[150px]">
                            📸 {order.customer.topperImageName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-purple-200">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-bold text-gray-900">
                    {order.customer.name} {order.customer.surname} ({order.customer.whatsapp})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Retirada:</span>
                  <span className="font-bold text-gray-900">
                    {new Date(order.customer.pickupDate + "T12:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-purple-200 text-base font-extrabold text-purple-900">
                  <span>Valor Estimado:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {order.isChristmasOrder && (
                  <div className="flex justify-between text-xs font-semibold text-amber-800">
                    <span>Sinal de Reserva (50%):</span>
                    <span>{formatCurrency(downPayment)}</span>
                  </div>
                )}
              </div>

              {/* Crucial Rule Warning: Order submission != confirmation */}
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 leading-relaxed">
                <p className="font-bold mb-1">⚠️ Aviso importante sobre a confirmação:</p>
                Ao clicar em <strong>Enviar Solicitação</strong>, o seu pedido será registrado em nosso sistema e você poderá enviar os dados diretamente para o WhatsApp da Janaína. <em>O pedido só é confirmado após a análise de agenda e aprovação da confeiteira.</em>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs">
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Navigation Buttons */}
        <div className="pt-4 border-t border-[#DDD6FE]/70 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2.5 rounded-xl border border-[#DDD6FE] text-xs sm:text-sm font-semibold text-[#1C1C2E] bg-white hover:bg-[#F5F3FF] transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Voltar
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isNextDisabled}
              className={`inline-flex items-center px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                isNextDisabled
                  ? "opacity-30 bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300 shadow-none pointer-events-none"
                  : "bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#EC4899] text-white shadow-xl shadow-[#8B5CF6]/50 animate-cta-alive cursor-pointer transform hover:scale-[1.03] active:scale-[0.98]"
              }`}
            >
              {isNextDisabled ? (
                <span>Selecione para avançar</span>
              ) : (
                <>
                  <span>Confirmar e Avançar</span>
                  <ChevronRightIcon className="w-4 h-4 ml-1.5 animate-pulse" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="inline-flex items-center px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-2xl transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 animate-cta-alive cursor-pointer"
            >
              {isSubmitting ? (
                <span>Registrando Encomenda...</span>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Enviar Solicitação pelo WhatsApp
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
