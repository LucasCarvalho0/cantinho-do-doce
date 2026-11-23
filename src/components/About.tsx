import React from "react";
import { SparklesIcon } from "./Icons";

export const About: React.FC = () => {
  return (
    <section id="apresentacao" className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Conheça Nossa História</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              O Toque Especial da Janaína
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full mb-6"></div>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              No <strong>Cantinho Doce</strong>, cada receita nasce da paixão em transformar açúcar, amor e dedicação em momentos inesquecíveis para você, sua família e seus convidados.
            </p>
          </div>

          {/* Grid with visual card and narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Visual presentation */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                <img
                  src="/images/bolo_roxo_elegante.jpg"
                  alt="Bolo artesanal elegante por Janaína Mendes"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white p-2">
                  <p className="text-lg font-bold font-serif">Janaína Mendes</p>
                  <p className="text-xs text-purple-200">Confeiteira & Artista dos Bolos</p>
                </div>
              </div>

              {/* Decorative accent card */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl p-4 shadow-xl border border-purple-100 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl shadow-sm">
                  ❤️
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Dedicação Total</p>
                  <p className="text-sm font-bold text-gray-900">100% Feito à Mão</p>
                </div>
              </div>
            </div>

            {/* Narrative & Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                Com anos de experiência e constante aprimoramento em confeitaria artística, Janaína cuida pessoalmente de cada etapa da sua encomenda. Desde a escolha de ingredientes de primeira linha até o batimento de recheios fartos e o ponto exato da massa, tudo é planejado para que seu bolo seja o grande destaque da sua comemoração.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">🥣</div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">Massa Fofinha & Macia</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Produzida artesanalmente nos sabores branca ou chocolate, molhadinha e equilibrada.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">🍓</div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">Recheios Generosos</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Até 2 recheios por bolo, combinando Ninho, Brigadeiro, Belga, frutas frescas e mousses.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">Decoração sob Medida</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Personalização de cores, topos e temas para aniversários infantis, casamentos e festas.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">📍</div>
                  <h4 className="font-bold text-gray-900 text-base mb-1">Retirada em Itatiaia</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Localização acessível em Cidade Jardim Itatiaia com data e horário previamente combinados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
