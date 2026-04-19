// Registers the Workbox-generated service worker in production builds.
// The SW is emitted by `scripts/build-pwa.mjs` after `vite build`.

export const NH_OFFLINE_READY_EVENT = 'nh-offline-ready';

declare global {
  interface Window {
    __NH_SW_REGISTERED__?: boolean;
    /** Set when precache is done and an active worker exists (prod only). */
    __NH_OFFLINE_READY__?: boolean;
  }
}

export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) return;
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (window.__NH_SW_REGISTERED__) return;
  window.__NH_SW_REGISTERED__ = true;

  const register = () => {
    navigator.serviceWorker
      .register('sw.js', { scope: './' })
      .then((reg) => {
        // Auto-update: if a new SW is waiting, activate it on next reload.
        reg.addEventListener('updatefound', () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener('statechange', () => {
            if (next.state === 'installed' && navigator.serviceWorker.controller) {
              // A new version is ready; it will take over on next reload.
            }
          });
        });
        return navigator.serviceWorker.ready;
      })
      .then(() => {
        window.__NH_OFFLINE_READY__ = true;
        window.dispatchEvent(new CustomEvent(NH_OFFLINE_READY_EVENT));
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}
