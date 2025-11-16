import React, { useState, useCallback, useMemo } from "react";
import { Order, Optional } from "../types";
import {
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
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
import { generateWhatsAppMessage, openWhatsApp } from "../utils/whatsapp";

interface OrderModalProps {
  order: Order;
  onClose: () => void;
  onOrderChange: (order: Order) => void;
}

const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  titles: string[];
}> = ({ currentStep, totalSteps, titles }) => (
  <div className="mb-6 sm:mb-8">
    <p className="text-sm font-semibold text-purple-600 text-center">
      PASSO {currentStep} / {totalSteps}
    </p>
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center mt-1">
      {titles[currentStep - 1]}
    </h2>
  </div>
);

export const OrderModal: React.FC<OrderModalProps> = ({
  order,
  onClose,
  onOrderChange,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleSelectFilling = (filling: string) => {
    const newFillings = order.fillings.includes(filling)
      ? order.fillings.filter((f) => f !== filling)
      : [...order.fillings, filling];

    if (newFillings.length <= 2) {
      onOrderChange({ ...order, fillings: newFillings });
    }
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

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !order.size;
      case 2:
        return !order.dough;
      case 3:
        return false; // Can have 0 fillings
      case 4:
        return !order.topping;
      case 5:
        const { name, surname, whatsapp, pickupDate, eventType, hasTopper } =
          order.customer;
        const isStandardOrderValid =
          name && surname && whatsapp && pickupDate && eventType && hasTopper;
        const isChristmasOrderValid =
          name && surname && whatsapp && pickupDate && hasTopper;
        return order.isChristmasOrder
          ? !isChristmasOrderValid
          : !isStandardOrderValid;
      default:
        return true;
    }
  }, [currentStep, order]);

  const handleConfirm = () => {
    const message = generateWhatsAppMessage(order);
    if (message) {
      openWhatsApp(message);
      onClose();
    }
  };

  const stepTitles = [
    `Selecione o ${order.isChristmasOrder ? "tamanho" : "bolo"}`,
    "Escolha a massa",
    "Escolha até 2 recheios",
    "Cobertura e Opcionais",
    "Dados e Resumo do Pedido",
  ];

  const availableCakes = order.isChristmasOrder
    ? ROUND_CAKES
    : [...ROUND_CAKES, ...SQUARE_CAKES];

  const inputBaseStyle =
    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition-all duration-200 text-base";
  const placeholderStyle = "placeholder:text-gray-400";
  const textStyle = "text-gray-800";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[95vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800 transition-colors z-10 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg"
        >
          <CloseIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <div className="p-4 sm:p-6 md:p-8 flex-grow overflow-y-auto">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
            titles={stepTitles}
          />

          {/* Step 1: Size */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {availableCakes.map((cake) => (
                <button
                  key={`${cake.type}-${cake.cm}`}
                  onClick={() => onOrderChange({ ...order, size: cake })}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                    order.size?.cm === cake.cm && order.size?.type === cake.type
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-300 shadow-sm"
                      : "border-gray-200 hover:border-purple-400 hover:bg-purple-50 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 capitalize">
                        {cake.type === "round" ? "Redondo" : "Quadrado"}{" "}
                        {cake.cm} cm
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {cake.slices}
                      </p>
                    </div>
                    <p className="font-bold text-xl text-purple-600 whitespace-nowrap">
                      R$ {cake.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Dough */}
          {currentStep === 2 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {DOUGHS.map((dough) => (
                <button
                  key={dough}
                  onClick={() =>
                    onOrderChange({
                      ...order,
                      dough: dough as "Branca" | "Chocolate",
                    })
                  }
                  className={`p-5 w-full sm:w-48 border-2 rounded-xl text-lg font-bold transition-all duration-200 hover:shadow-md min-h-[80px] ${
                    order.dough === dough
                      ? "border-purple-500 bg-purple-50 ring-2 ring-purple-300 shadow-sm"
                      : "border-gray-200 hover:border-purple-400 hover:bg-purple-50 bg-white"
                  }`}
                >
                  {dough}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Fillings */}
          {currentStep === 3 && (
            <div>
              <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
                Selecionados: {order.fillings.length} de 2
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {FILLINGS.map((filling) => (
                  <button
                    key={filling}
                    onClick={() => handleSelectFilling(filling)}
                    disabled={
                      order.fillings.length >= 2 &&
                      !order.fillings.includes(filling)
                    }
                    className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 text-center font-medium text-sm sm:text-base min-h-[60px] flex items-center justify-center ${
                      order.fillings.includes(filling)
                        ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-200 shadow-sm"
                        : "border-gray-200 hover:border-purple-400 bg-white hover:shadow-md"
                    } ${
                      order.fillings.length >= 2 &&
                      !order.fillings.includes(filling)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:shadow-none"
                        : ""
                    }`}
                  >
                    {order.fillings.includes(filling) && (
                      <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 text-purple-500 flex-shrink-0" />
                    )}
                    <span className="truncate">{filling}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Topping & Optionals */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="font-bold text-lg text-gray-700 mb-4">
                  Cobertura (escolha 1)
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {TOPPINGS.map((topping) => (
                    <button
                      key={topping}
                      onClick={() => onOrderChange({ ...order, topping })}
                      className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 text-center font-medium text-sm sm:text-base min-h-[60px] flex items-center justify-center ${
                        order.topping === topping
                          ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-200 shadow-sm"
                          : "border-gray-200 hover:border-purple-400 bg-white hover:shadow-md"
                      }`}
                    >
                      {order.topping === topping && (
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 text-purple-500 flex-shrink-0" />
                      )}
                      {topping}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-700 mb-4">
                  Opcionais (somar ao valor)
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {OPTIONALS.map((optional) => (
                    <button
                      key={optional.name}
                      onClick={() => handleSelectOptional(optional)}
                      className={`w-full p-3 sm:p-4 border rounded-lg transition-all duration-200 text-left flex justify-between items-center hover:shadow-md ${
                        order.optionals.some((o) => o.name === optional.name)
                          ? "border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-200 shadow-sm"
                          : "border-gray-200 hover:border-purple-400 bg-white"
                      }`}
                    >
                      <span className="flex items-center text-sm sm:text-base">
                        {order.optionals.some(
                          (o) => o.name === optional.name
                        ) && (
                          <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 text-purple-500 flex-shrink-0" />
                        )}
                        {optional.name}
                      </span>
                      <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                        + R$ {optional.price.toFixed(2).replace(".", ",")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Nome"
                  value={order.customer.name}
                  onChange={(e) =>
                    onOrderChange({
                      ...order,
                      customer: { ...order.customer, name: e.target.value },
                    })
                  }
                  className={`${inputBaseStyle} ${placeholderStyle} ${textStyle}`}
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  value={order.customer.surname}
                  onChange={(e) =>
                    onOrderChange({
                      ...order,
                      customer: { ...order.customer, surname: e.target.value },
                    })
                  }
                  className={`${inputBaseStyle} ${placeholderStyle} ${textStyle}`}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (com DDD)"
                  value={order.customer.whatsapp}
                  onChange={(e) =>
                    onOrderChange({
                      ...order,
                      customer: { ...order.customer, whatsapp: e.target.value },
                    })
                  }
                  className={`${inputBaseStyle} ${placeholderStyle} ${textStyle}`}
                />
                <input
                  type="date"
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
                  className={`${inputBaseStyle} ${
                    !order.customer.pickupDate ? "text-gray-400" : textStyle
                  }`}
                />
                {!order.isChristmasOrder && (
                  <select
                    value={order.customer.eventType || ""}
                    onChange={(e) =>
                      onOrderChange({
                        ...order,
                        customer: {
                          ...order.customer,
                          eventType: e.target.value,
                        },
                      })
                    }
                    className={`${inputBaseStyle} ${
                      !order.customer.eventType ? "text-gray-400" : textStyle
                    }`}
                  >
                    <option value="" disabled>
                      Tipo de Evento
                    </option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type} className="text-gray-800">
                        {type}
                      </option>
                    ))}
                  </select>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Terá topo de bolo?
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        onOrderChange({
                          ...order,
                          customer: { ...order.customer, hasTopper: "sim" },
                        })
                      }
                      className={`w-full text-center p-3 border-2 rounded-lg font-medium transition-all duration-200 min-h-[52px] ${
                        order.customer.hasTopper === "sim"
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-300 shadow-sm"
                          : "border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md"
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() =>
                        onOrderChange({
                          ...order,
                          customer: { ...order.customer, hasTopper: "não" },
                        })
                      }
                      className={`w-full text-center p-3 border-2 rounded-lg font-medium transition-all duration-200 min-h-[52px] ${
                        order.customer.hasTopper === "não"
                          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-300 shadow-sm"
                          : "border-gray-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md"
                      }`}
                    >
                      Não
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Se desejar, descreva o tema ou decoração (Ex: Personagem, cores, etc.)"
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
                  className={`${inputBaseStyle} ${placeholderStyle} ${textStyle} h-24 resize-none`}
                  rows={3}
                />
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border border-purple-200">
                <h3 className="font-bold text-lg mb-4 text-gray-800">
                  Resumo do Pedido
                </h3>
                <div className="space-y-3 text-sm sm:text-base text-gray-600">
                  <p>
                    <strong>Bolo:</strong>{" "}
                    {order.size?.type === "round" ? "Redondo" : "Quadrado"}{" "}
                    {order.size?.cm}cm (R${" "}
                    {order.size?.price.toFixed(2).replace(".", ",")})
                  </p>
                  <p>
                    <strong>Massa:</strong> {order.dough}
                  </p>
                  <p>
                    <strong>Recheios:</strong>{" "}
                    {order.fillings.join(", ") || "Nenhum"}
                  </p>
                  <p>
                    <strong>Cobertura:</strong> {order.topping}
                  </p>
                  {order.optionals.length > 0 && (
                    <p>
                      <strong>Opcionais:</strong>{" "}
                      {order.optionals
                        .map(
                          (o) =>
                            `${o.name} (R$ ${o.price
                              .toFixed(2)
                              .replace(".", ",")})`
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
                <hr className="my-4 border-purple-200" />
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Subtotal</p>
                  <p className="font-bold text-2xl sm:text-3xl text-purple-700">
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                {order.isChristmasOrder && (
                  <>
                    <hr className="my-4 border-purple-200" />
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-gray-600 text-sm">Entrada (50%)</p>
                        <p className="font-semibold text-lg text-green-600">
                          R$ {(subtotal * 0.5).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">
                          Restante na retirada
                        </p>
                        <p className="font-semibold text-lg text-gray-700">
                          R$ {(subtotal * 0.5).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-xs text-red-600 bg-red-100 p-2 rounded-md">
                      A encomenda de Natal só fica reservada após pagamento da
                      entrada de 50%.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with navigation */}
        <div className="flex-shrink-0 bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[48px] min-w-[100px]"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Voltar
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className="flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-200 min-h-[48px] min-w-[120px]"
              >
                Próximo
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={isNextDisabled}
                className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-200 min-h-[48px] min-w-[180px] flex items-center justify-center"
              >
                <span className="mr-2">📱</span>
                Confirmar via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
