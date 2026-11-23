import React, { useState, useEffect, useRef } from "react";

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("ESCOLHENDO OS SABORES");
  const [currentStep, setCurrentStep] = useState<"loading" | "celebration" | "done">("loading");
  const [isFadingOut, setIsFadingOut] = useState(false);

  const animationRef = useRef<number | null>(null);

  // 3.0 seconds duration for a quick, lively, visible 0 -> 100% count
  const DURATION = 3000;

  useEffect(() => {
    let isCancelled = false;
    const startTime = performance.now();

    const updateDisplay = (intVal: number) => {
      setProgress(intVal);
      if (intVal < 25) {
        setStatusText("ESCOLHENDO OS SABORES");
      } else if (intVal < 50) {
        setStatusText("BATENDO A MASSA ARTESANAL");
      } else if (intVal < 75) {
        setStatusText("ASSANDO NO PONTO PERFEITO");
      } else if (intVal < 95) {
        setStatusText("CONFEITANDO COM CARINHO");
      } else {
        setStatusText("PRONTO PARA CELEBRAR!");
      }
    };

    const handleReach100 = () => {
      if (isCancelled) return;
      updateDisplay(100);

      // Brief moment at 100% then switch directly to Feliz 2027 screen
      setTimeout(() => {
        if (isCancelled) return;
        setCurrentStep("celebration");
      }, 350);
    };

    const tick = (now: number) => {
      if (isCancelled) return;

      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const currentProgress = Math.min(Math.floor(t * 100), 100);

      updateDisplay(currentProgress);

      if (t >= 1) {
        handleReach100();
        return;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    // Dev shortcut: Space or R to replay
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key.toLowerCase() === "r") {
        if (
          (e.target as HTMLElement)?.tagName === "INPUT" ||
          (e.target as HTMLElement)?.tagName === "TEXTAREA"
        )
          return;
        e.preventDefault();
        restart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      isCancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleEnterSite = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setCurrentStep("done");
      if (onComplete) onComplete();
    }, 600);
  };

  const restart = () => {
    setIsFadingOut(false);
    setCurrentStep("loading");
    setProgress(0);
    setStatusText("ESCOLHENDO OS SABORES");
  };

  if (currentStep === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden font-sans select-none transition-opacity duration-600 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <style>{`
        /* Dynamic Kinetic Orbit for Cake Plates */
        @keyframes km-cake-1 {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          25%  { transform: translate3d(-8px, -8px, 0) rotate(90deg) scale(1.08); }
          50%  { transform: translate3d(52px, 0, 0) rotate(180deg) scale(1); }
          75%  { transform: translate3d(52px, 52px, 0) rotate(270deg) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) rotate(360deg) scale(1); }
        }
        @keyframes km-cake-2 {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          25%  { transform: translate3d(8px, -8px, 0) rotate(-90deg) scale(1.08); }
          50%  { transform: translate3d(0, 52px, 0) rotate(-180deg) scale(1); }
          75%  { transform: translate3d(-52px, 52px, 0) rotate(-270deg) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) rotate(-360deg) scale(1); }
        }
        @keyframes km-cake-3 {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          25%  { transform: translate3d(8px, 8px, 0) rotate(90deg) scale(1.08); }
          50%  { transform: translate3d(-52px, 0, 0) rotate(180deg) scale(1); }
          75%  { transform: translate3d(-52px, -52px, 0) rotate(270deg) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) rotate(360deg) scale(1); }
        }
        @keyframes km-cake-4 {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          25%  { transform: translate3d(-8px, 8px, 0) rotate(-90deg) scale(1.08); }
          50%  { transform: translate3d(0, -52px, 0) rotate(-180deg) scale(1); }
          75%  { transform: translate3d(52px, -52px, 0) rotate(-270deg) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) rotate(-360deg) scale(1); }
        }

        .km-cake-anim-1 { animation: km-cake-1 3.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        .km-cake-anim-2 { animation: km-cake-2 3.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        .km-cake-anim-3 { animation: km-cake-3 3.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
        .km-cake-anim-4 { animation: km-cake-4 3.4s cubic-bezier(0.65, 0, 0.35, 1) infinite; }

        @keyframes center-pulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .animate-center-pulse {
          animation: center-pulse 2.2s ease-in-out infinite;
        }

        @keyframes snow-drift {
          0% { transform: translateY(-8px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(12px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(-8px) rotate(360deg); opacity: 0.8; }
        }
        .animate-snow-slow {
          animation: snow-drift 5s ease-in-out infinite;
        }
      `}</style>

      {/* ============================================================== */}
      {/* ETAPA 1: TELA DE CARREGAMENTO COM BOLOS (0% a 100%) */}
      {/* ============================================================== */}
      {currentStep === "loading" && (
        <div className="absolute inset-0 bg-[#141224] flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center justify-center p-6 text-center max-w-sm w-full">
            {/* Tag oficial */}
            <div className="mb-4 inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30">
              <span className="text-xs">🍰</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#DDD6FE]">
                Cantinho Doce • Bolos Artesanais
              </span>
              <span className="text-xs text-[#A78BFA]">✦</span>
            </div>

            {/* Órbita de Bolos Artesanais */}
            <div className="relative p-4 mb-6">
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#8B5CF6]/60"></span>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#8B5CF6]/60"></span>
              <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#8B5CF6]/60"></span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#8B5CF6]/60"></span>

              <div className="relative w-[96px] h-[96px] flex items-center justify-center">
                {/* Ícone Central */}
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center animate-center-pulse shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                  <span className="text-xl">🎂</span>
                </div>

                {/* Bolo 1: Morango */}
                <div className="km-cake-anim-1 absolute top-0 left-0 w-11 h-11 rounded-full p-0.5 bg-white shadow-lg border-2 border-white overflow-hidden">
                  <img
                    src="/images/bolo_morango_25cm.jpg"
                    alt="Bolo Morango"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Bolo 2: Rosas Lilás */}
                <div className="km-cake-anim-2 absolute top-0 right-0 w-11 h-11 rounded-full p-0.5 bg-[#8B5CF6] shadow-[0_0_22px_rgba(139,92,246,0.9)] border-2 border-[#C4B5FD] overflow-hidden">
                  <img
                    src="/images/bolo_rosas_30cm.jpg"
                    alt="Bolo Rosas"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Bolo 3: Branco Dourado */}
                <div className="km-cake-anim-3 absolute bottom-0 right-0 w-11 h-11 rounded-full p-0.5 bg-white shadow-lg border-2 border-[#FEF08A] overflow-hidden">
                  <img
                    src="/images/bolo_branco_dourado_festa.jpg"
                    alt="Bolo Branco Dourado"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Bolo 4: Oreo */}
                <div className="km-cake-anim-4 absolute bottom-0 left-0 w-11 h-11 rounded-full p-0.5 bg-white shadow-lg border-2 border-[#DDD6FE] overflow-hidden">
                  <img
                    src="/images/bolo_oreo_25cm.jpg"
                    alt="Bolo Oreo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Contador de Porcentagem até 100% */}
            <div
              className="flex items-baseline justify-center mb-4"
              style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
            >
              <span
                className={`text-6xl sm:text-7xl font-extrabold tracking-tighter tabular-nums min-w-[130px] text-right transition-all duration-150 ${
                  progress === 100
                    ? "text-[#C4B5FD] drop-shadow-[0_0_25px_rgba(196,181,253,0.9)] scale-105"
                    : "text-white drop-shadow-md"
                }`}
              >
                {progress}
              </span>
              <span className="text-2xl font-bold text-[#A78BFA] ml-1.5 -translate-y-2">
                %
              </span>
            </div>

            {/* Barra de Progresso e Status */}
            <div className="w-full max-w-[280px] sm:max-w-[320px] flex flex-col gap-2.5">
              <div
                className="flex justify-between items-center text-[10px] sm:text-[11px] font-bold tracking-widest uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <span className="text-[#8E8AAB]">CANTINHO DOCE</span>
                <span
                  className={`transition-colors duration-200 ${
                    progress === 100 ? "text-[#EDE9FE] font-extrabold" : "text-[#C4B5FD]"
                  }`}
                >
                  {statusText}
                </span>
              </div>

              <div className="w-full h-2 bg-[#25223A] rounded-full relative overflow-visible border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-white rounded-full transition-all duration-75 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <span className="absolute -right-1.5 -top-1 w-4 h-4 rounded-full bg-[#C4B5FD] shadow-[0_0_14px_#A78BFA] border-2 border-[#1B1830]"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ETAPA 2: TELA ESPECIAL "FELIZ 2027!" COM DETALHES DE NATAL */}
      {/* (Fundo 100% opaco, cobre o site até a celebração terminar) */}
      {/* ============================================================== */}
      {currentStep === "celebration" && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#161329] via-[#241F3D] to-[#121020] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          {/* Efeitos Decorativos de Natal & Fim de Ano */}
          <div className="absolute top-10 left-8 text-3xl sm:text-4xl animate-snow-slow opacity-80">
            ❄️
          </div>
          <div className="absolute top-14 right-10 text-2xl sm:text-3xl animate-snow-slow opacity-90 delay-300">
            ✨
          </div>
          <div className="absolute bottom-14 left-10 text-3xl sm:text-4xl animate-snow-slow opacity-85 delay-700">
            🎄
          </div>
          <div className="absolute bottom-12 right-12 text-3xl sm:text-4xl animate-snow-slow opacity-80 delay-500">
            ⭐
          </div>
          <div className="absolute top-1/3 left-6 text-2xl opacity-60">
            🎅
          </div>
          <div className="absolute top-1/3 right-6 text-2xl opacity-60">
            🎁
          </div>

          {/* Conteúdo Central Festivo */}
          <div className="max-w-lg w-full flex flex-col items-center animate-fade-in-up">
            {/* Badge de Natal */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#DDD6FE] text-xs font-bold mb-5 shadow-lg backdrop-blur-md">
              <span>🎄</span>
              <span>Especial de Fim de Ano & Natal</span>
              <span>✨</span>
            </div>

            {/* Logo do Cantinho Doce com iluminação */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2.5 shadow-2xl border-2 border-[#DDD6FE] mb-5 flex items-center justify-center transform hover:scale-105 transition-transform">
              <img
                src="/icons/icon-192x192.png"
                alt="Cantinho Doce"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Título Principal Feliz 2027 */}
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-2 drop-shadow-lg">
              Feliz{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C4B5FD] via-[#DDD6FE] to-[#F472B6]">
                2027!
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-[#DDD6FE] mb-2 font-script tracking-wide">
              Boas Festas & Celebrações Doces
            </p>

            <p className="text-xs sm:text-sm text-[#C4B5FD]/90 max-w-md mx-auto mb-7 leading-relaxed">
              Bem-vindo ao <strong>Cantinho Doce</strong> por Janaína Mendes. Onde cada fatia é preparada com amor para adoçar os seus melhores momentos!
            </p>

            {/* Botão de Ação Direta para Entrar no Site */}
            <button
              onClick={handleEnterSite}
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#A855F7] shadow-xl shadow-[#8B5CF6]/50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20 animate-pulse hover:animate-none"
            >
              <span className="mr-2.5 text-lg">🍰</span>
              Entrar no Cardápio Cantinho Doce
              <span className="ml-2.5 text-lg">➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preloader;
