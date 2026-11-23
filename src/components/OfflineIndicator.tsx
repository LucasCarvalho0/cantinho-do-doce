import React, { useState, useEffect } from "react";

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-amber-500/95 text-white p-3 sm:p-4 rounded-xl shadow-xl backdrop-blur-sm flex items-center justify-between border border-amber-300/40 animate-fade-in-up">
      <div className="flex items-center space-x-3">
        <span className="text-xl">📡</span>
        <div className="text-xs sm:text-sm">
          <p className="font-bold">Modo Offline Ativo</p>
          <p className="opacity-90">Você pode ver o cardápio, mas para encomendar conecte-se à internet.</p>
        </div>
      </div>
    </div>
  );
};
