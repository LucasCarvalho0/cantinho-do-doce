import React from "react";
import { SparklesIcon } from "./Icons";

export const InfoSection: React.FC = () => {
  const cards = [
    {
      icon: "📋",
      title: "Como Encomendar",
      content:
        "Escolha o tamanho e monte o bolo passo a passo pelo nosso sistema online. Ao finalizar, sua solicitação é registrada e enviada para o WhatsApp da Janaína para confirmação da data e valor final.",
    },
    {
      icon: "💳",
      title: "Formas de Pagamento",
      content:
        "Aceitamos PIX, Cartões de Débito/Crédito e Dinheiro. Para encomendas natalinas e especiais, solicitamos 50% de entrada no ato da confirmação para garantia da reserva de agenda.",
    },
    {
      icon: "🚗",
      title: "Retirada em Itatiaia",
      content:
        "As retiradas são feitas no nosso endereço em Cidade Jardim Itatiaia com data e horário previamente combinados, garantindo que seu bolo esteja fresquinho e impecável.",
    },
    {
      icon: "⏰",
      title: "Prazo de Antecedência",
      content:
        "Recomendamos encomendar com no mínimo 3 a 5 dias de antecedência. Para finais de semana concorridos e datas sazonais, reserve com o máximo de antecedência possível.",
    },
    {
      icon: "🎂",
      title: "Personalização & Temas",
      content:
        "Todos os bolos podem ter a decoração e cores adaptadas para a sua festa. Confeccionamos topos de bolo personalizados mediante solicitação no formulário.",
    },
    {
      icon: "🧊",
      title: "Conservação & Transporte",
      content:
        "Nossos bolos são entregues em embalagens reforçadas para transporte seguro. Mantenha sob refrigeração e retire cerca de 20 minutos antes de servir para máxima maciez.",
    },
  ];

  return (
    <section id="informacoes" className="py-16 sm:py-24 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-3">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Dúvidas Frequentes & Orientações</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Informações Importantes
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tudo o que você precisa saber antes de fazer sua encomenda com a Janaína.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {cards.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl border border-purple-100 hover:border-purple-200 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
