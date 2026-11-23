import React, { useState, useEffect, useCallback } from "react";
import {
  isStandalone,
  isIOS,
  isAndroid,
  isInstallPromptDismissed,
  dismissInstallPrompt,
  promptPwaInstall,
} from "../utils/pwa";
import { DownloadIcon, CloseIcon, SparklesIcon } from "./Icons";

interface PwaInstallBannerProps {
  canInstallPrompt: boolean;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ canInstallPrompt }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [guideModal, setGuideModal] = useState<"ios" | "android" | null>(null);

  // Trigger installation flow (Android / Chromium or iOS / Safari guide)
  const handleInstallClick = useCallback(async () => {
    if (isIOS()) {
      setGuideModal("ios");
      return;
    }

    if (canInstallPrompt) {
      try {
        const accepted = await promptPwaInstall();
        if (accepted) {
          setIsVisible(false);
          return;
        }
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
    }

    // Fallback if browser hasn't fired beforeinstallprompt or needs manual addition
    if (isAndroid()) {
      setGuideModal("android");
    } else {
      setGuideModal("android");
    }
  }, [canInstallPrompt]);

  useEffect(() => {
    // Never auto-show if already installed as standalone app or previously dismissed
    if (isStandalone() || isInstallPromptDismissed()) {
      setIsVisible(false);
    } else {
      // Elegant appearance 1.2s after page load for immediate discovery
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Listen for manual install requests from Header, Footer or Menu
    const handleManualRequest = () => {
      setIsVisible(true);
      handleInstallClick();
    };

    window.addEventListener("cantinho:request-pwa-install", handleManualRequest);
    return () => {
      window.removeEventListener("cantinho:request-pwa-install", handleManualRequest);
    };
  }, [handleInstallClick]);

  // "Continuar pelo site": Does NOT block navigation, saves dismissal for 2 days, closes cleanly
  const handleContinueOnSite = () => {
    setIsVisible(false);
    dismissInstallPrompt(2);
  };

  // If already running standalone, do not render any installation prompts
  if (isStandalone()) return null;
  if (!isVisible && !guideModal) return null;

  return (
    <>
      {/* Convite Inteligente e Não Invasivo de Instalação */}
      {isVisible && (
        <aside
          role="complementary"
          aria-label="Convite para instalar o aplicativo Cantinho Doce"
          className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl border border-[#DDD6FE] transition-all duration-300 animate-fade-in-up"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white flex items-center justify-center border-2 border-[#DDD6FE] shadow-sm flex-shrink-0 p-1">
                <img
                  src="/icons/icon-192x192.png"
                  alt="Logo Cantinho Doce"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#5B21B6]">
                    Aplicativo Oficial
                  </span>
                  <SparklesIcon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-[#1C1C2E] mt-1 leading-snug">
                  Instalar aplicativo Cantinho Doce?
                </h4>
              </div>
            </div>
            <button
              onClick={handleContinueOnSite}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Fechar convite"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#6B7280] mt-2.5 leading-relaxed">
            Instale no seu telefone para ter acesso instantâneo ao cardápio de bolos, novidades e fazer encomendas direto com a Janaína Mendes!
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <DownloadIcon className="w-4 h-4 mr-1.5" />
              Instalar aplicativo
            </button>
            <button
              onClick={handleContinueOnSite}
              className="px-3.5 py-2.5 rounded-full text-xs font-bold text-[#6B7280] hover:text-[#1C1C2E] hover:bg-[#F5F3FF] transition-colors"
            >
              Continuar pelo site
            </button>
          </div>
        </aside>
      )}

      {/* Guia Especial para iPhone & iPad (Safari / iOS) */}
      {guideModal === "ios" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up"
          onClick={() => setGuideModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDD6FE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/icons/apple-touch-icon.png"
                  alt="Cantinho Doce"
                  className="w-9 h-9 rounded-xl bg-white p-0.5 border border-[#DDD6FE] shadow-xs object-contain"
                />
                <h3 className="text-base font-bold text-[#1C1C2E]">Instalar no iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setGuideModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                aria-label="Fechar guia"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
              Para instalar o aplicativo no seu iOS (iPhone ou iPad), siga estes 3 passos simples no Safari:
            </p>

            <ol className="space-y-3 text-xs text-[#1C1C2E]">
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  1
                </span>
                <span>
                  Toque no botão <strong>Compartilhar</strong> (ícone de um quadrado com seta para cima <span className="inline-block px-1.5 py-0.5 bg-white rounded border border-[#DDD6FE] text-[#8B5CF6] font-bold">⎋</span>) na barra do Safari.
                </span>
              </li>
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  2
                </span>
                <span>
                  Role a lista para cima e toque em <strong>"Adicionar à Tela de Início"</strong> (ícone <span className="inline-block px-1.5 py-0.5 bg-white rounded border border-[#DDD6FE] text-[#8B5CF6] font-bold">➕</span>).
                </span>
              </li>
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  3
                </span>
                <span>
                  No canto superior direito, toque em <strong>"Adicionar"</strong>. O aplicativo ficará salvo na sua tela inicial!
                </span>
              </li>
            </ol>

            <button
              onClick={() => {
                setGuideModal(null);
                handleContinueOnSite();
              }}
              className="mt-5 w-full py-3 rounded-full font-extrabold text-xs text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-transform active:scale-[0.98]"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}

      {/* Guia para Android caso o prompt direto esteja desabilitado no navegador */}
      {guideModal === "android" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up"
          onClick={() => setGuideModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#DDD6FE]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/icons/apple-touch-icon.png"
                  alt="Cantinho Doce"
                  className="w-9 h-9 rounded-xl bg-white p-0.5 border border-[#DDD6FE] shadow-xs object-contain"
                />
                <h3 className="text-base font-bold text-[#1C1C2E]">Instalar no Android</h3>
              </div>
              <button
                onClick={() => setGuideModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                aria-label="Fechar guia"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
              Para instalar o aplicativo no seu Android pelo Google Chrome ou Samsung Internet:
            </p>

            <ol className="space-y-3 text-xs text-[#1C1C2E]">
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  1
                </span>
                <span>
                  Toque no menu de <strong>três pontinhos (⋮)</strong> no canto superior direito do navegador.
                </span>
              </li>
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  2
                </span>
                <span>
                  Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-3 bg-[#F5F3FF] p-3 rounded-2xl border border-[#DDD6FE]">
                <span className="font-extrabold text-[#5B21B6] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs flex-shrink-0">
                  3
                </span>
                <span>
                  Confirme em <strong>"Instalar"</strong>. O ícone aparecerá imediatamente entre os aplicativos do seu aparelho!
                </span>
              </li>
            </ol>

            <button
              onClick={() => {
                setGuideModal(null);
                handleContinueOnSite();
              }}
              className="mt-5 w-full py-3 rounded-full font-extrabold text-xs text-white bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/30 transition-transform active:scale-[0.98]"
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallBanner;
