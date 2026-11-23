let deferredPrompt: any = null;

export const PWA_DISMISS_KEY = "cantinho_pwa_dismissed_until";

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
  const isIpadOs =
    (window.navigator as any).platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;
  return isIosDevice || isIpadOs;
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

export function isInstallPromptDismissed(): boolean {
  if (typeof window === "undefined") return true;
  if (window.location.search.includes("pwa") || window.location.search.includes("install")) {
    return false;
  }
  return sessionStorage.getItem("cantinho_pwa_dismissed") === "true";
}

export function dismissInstallPrompt(_days = 1) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("cantinho_pwa_dismissed", "true");
  localStorage.removeItem(PWA_DISMISS_KEY);
}

export function resetDismissal() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("cantinho_pwa_dismissed");
  localStorage.removeItem(PWA_DISMISS_KEY);
}

export function requestAppInstall() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cantinho:request-pwa-install"));
}

export function initPwaListeners(
  onCanInstall: (canInstall: boolean) => void,
  onUpdateAvailable: () => void
) {
  if (typeof window === "undefined") return;

  // Listen for beforeinstallprompt (Android / Chromium)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    onCanInstall(true);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    onCanInstall(false);
    console.log(" Cantinho Doce PWA instalado com sucesso!");
  });

  // Register Service Worker in production or supporting dev
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for SW updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  onUpdateAvailable();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });
    });
  }
}

export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }
  deferredPrompt.prompt();
  const choiceResult = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choiceResult.outcome === "accepted";
}
