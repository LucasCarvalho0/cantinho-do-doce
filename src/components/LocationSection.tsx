import React from "react";
import { WhatsAppIcon, MapPinIcon } from "./Icons";
import { WHATSAPP_NUMBER } from "../constants";

interface LocationSectionProps {
  whatsappNumber?: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ whatsappNumber }) => {
  const phone = whatsappNumber || WHATSAPP_NUMBER;
  const cleanPhone = phone.replace(/\D/g, "");

  return (
    <section id="contato" className="py-16 sm:py-24 bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-purple-50/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-3">
            <MapPinIcon className="w-3.5 h-3.5" />
            <span>Localização & Retirada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
            Venha nos Conhecer
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Localização fácil e segura para a retirada da sua encomenda no coração de Itatiaia.
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 grid grid-cols-1 lg:grid-cols-12">
          {/* Map Frame */}
          <div className="lg:col-span-7 h-72 sm:h-96 lg:h-[480px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.3811887527086!2d-44.56412392492473!3d-22.48987697955072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9dd8082eccd3e1%3A0x3c959d8bd62d55c6!2sR.%20Quatorze%2C%2034%20-%20Cidade%20Jardim%20Itatiaia%2C%20Itatiaia%20-%20RJ%2C%2027580-000!5e0!3m2!1spt-BR!2sbr!4v1763307865511!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do Cantinho Doce em Itatiaia"
            />
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-purple-900 to-purple-950 text-white">
            <div>
              <div className="flex items-center space-x-2 text-pink-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <span>Endereço de Retirada</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-white">
                Cidade Jardim Itatiaia
              </h3>
              <p className="text-purple-200 text-sm sm:text-base leading-relaxed mb-6">
                Rua Quatorze, nº 34
                <br />
                Itatiaia - RJ | CEP: 27580-000
              </p>

              <div className="space-y-3.5 text-xs sm:text-sm text-purple-200 border-t border-purple-800/80 pt-6">
                <div className="flex items-start space-x-3">
                  <span className="text-pink-400 text-base">⏰</span>
                  <div>
                    <strong className="text-white">Horários de Retirada:</strong>
                    <p>Segunda a Sábado: 09h às 19h</p>
                    <p>Domingo: 09h às 12h (sob agendamento)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-pink-400 text-base">🚗</span>
                  <div>
                    <strong className="text-white">Estacionamento:</strong>
                    <p>Fácil acesso e parada rápida na porta para retirada.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href="https://maps.google.com/?q=Rua+Quatorze,34,Cidade+Jardim+Itatiaia,Itatiaia,RJ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm bg-white text-purple-950 hover:bg-purple-100 shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <MapPinIcon className="w-4 h-4 mr-2 text-purple-700" />
                Como Chegar (Google Maps)
              </a>

              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Conversar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
