import React from "react";
import { InstagramIcon, WhatsAppIcon, MapPinIcon } from "./Icons.tsx";
import { WHATSAPP_NUMBER } from "../utils/whatsapp.ts";
import { requestAppInstall } from "../utils/pwa.ts";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1C2E] text-[#E9D5FF] pt-14 pb-10 border-t border-[#2D2B55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo-jana01.png"
                alt="Logo Cantinho Doce"
                className="w-12 h-12 rounded-2xl bg-[#EDE9FE] p-1 object-contain"
              />
              <div>
                <h3 className="text-xl font-extrabold font-serif text-white">
                  Cantinho Doce
                </h3>
                <p className="text-xs text-[#C4B5FD] font-semibold">
                  por Janaína Mendes
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A78BFA] leading-relaxed max-w-sm">
              Confeitaria artesanal especializada em bolos personalizados, aniversários, casamentos e momentos inesquecíveis em Itatiaia - RJ.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <a
                href="https://www.instagram.com/cakecantinho/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-[#8B5CF6] transition-colors text-white"
                aria-label="Instagram da Janaína Mendes"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-emerald-600 transition-colors text-white"
                aria-label="WhatsApp da Janaína Mendes"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Cardápio de Bolos
            </h4>
            <ul className="space-y-2 text-xs text-[#A78BFA]">
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  🎂 Bolos de Aniversário
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  ✨ Bolos Artísticos & Personalizados
                </a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-white transition-colors">
                  🎄 Especial Natal & Ano Novo
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => requestAppInstall()}
                  className="hover:text-white transition-colors flex items-center space-x-1.5 text-left text-xs text-[#C4B5FD] hover:underline"
                >
                  <span>📲</span>
                  <span>Instalar Aplicativo (App)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Retirada & Atendimento
            </h4>
            <div className="text-xs text-[#A78BFA] space-y-2 leading-relaxed">
              <p className="flex items-start space-x-2">
                <MapPinIcon className="w-4 h-4 text-[#C4B5FD] flex-shrink-0 mt-0.5" />
                <span>
                  Rua Quatorze, 34 — Cidade Jardim Itatiaia
                  <br />
                  Itatiaia - RJ, 27580-000
                </span>
              </p>
              <p>
                <strong className="text-white">Horários:</strong> Segunda a Sábado: 09h às 19h | Domingo: 09h às 12h
              </p>
              <p>
                <strong className="text-white">WhatsApp Direto:</strong> (24) 99967-9906
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Rua+Quatorze,34,Cidade+Jardim+Itatiaia,Itatiaia,RJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-[#C4B5FD] hover:text-white hover:underline"
                >
                  <span>Ver localização no Google Maps</span>
                  <span className="ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Destacado para Instalação do Aplicativo PWA */}
        <div className="my-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#242240] via-[#2D2B55] to-[#1E1C38] border border-[#8B5CF6]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md flex-shrink-0 border-2 border-[#DDD6FE]">
              <img
                src="/icons/icon-192x192.png"
                alt="Logo Cantinho Doce"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C4B5FD] bg-[#8B5CF6]/20 px-2.5 py-0.5 rounded-full border border-[#8B5CF6]/30">
                  Aplicativo Oficial
                </span>
                <span className="text-xs text-[#C4B5FD]">✦</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                Instale o Aplicativo Cantinho Doce
              </h4>
              <p className="text-xs text-[#C4B5FD]/90 mt-0.5 leading-relaxed">
                Acesse o cardápio completo com fotos, monte seu bolo e envie seu pedido com 1 toque!
              </p>
            </div>
          </div>
          <button
            onClick={() => requestAppInstall()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-lg shadow-[#8B5CF6]/40 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex-shrink-0"
          >
            <span className="text-base mr-2">📲</span>
            Instalar Aplicativo
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2D2B55] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7C6FAD]">
          <p>
            &copy; {new Date().getFullYear()} Cantinho Doce por Janaína Mendes. Todos os direitos reservados.
          </p>
          <p className="flex items-center space-x-1">
            <span>Feito com</span>
            <span className="text-[#C4B5FD]">💜</span>
            <span>e dedicação em Itatiaia - RJ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
