"use client";

import { useEffect, useRef } from "react";

/**
 * Intègre le simulateur de prestation compensatoire (fichier statique
 * /simulateur/index.html) via une iframe même-origine, et ajuste
 * automatiquement sa hauteur au contenu (message postMessage émis par la page).
 */
export function SimulateurEmbed() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { fainSimHeight?: number };
      if (data && typeof data.fainSimHeight === "number" && ref.current) {
        ref.current.style.height = data.fainSimHeight + 24 + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src="/simulateur/index.html?embed=1"
      title="Simulateur de prestation compensatoire"
      loading="lazy"
      className="w-full block rounded-lg bg-white"
      style={{ border: 0, height: 1300, width: "100%" }}
    />
  );
}
