"use client";

import { useEffect, useRef } from "react";

/**
 * Intègre un simulateur statique (par défaut celui de prestation compensatoire,
 * /simulateur/index.html) via une iframe même-origine, et ajuste
 * automatiquement sa hauteur au contenu (message postMessage émis par la page).
 */
export function SimulateurEmbed({
  src = "/simulateur/index.html?embed=1",
  title = "Simulateur de prestation compensatoire",
  hauteurInitiale = 1300,
}: {
  src?: string;
  title?: string;
  hauteurInitiale?: number;
} = {}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { fainSimHeight?: number };
      if (data && typeof data.fainSimHeight === "number" && ref.current) {
        ref.current.style.height = data.fainSimHeight + "px";
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      loading="lazy"
      className="w-full block rounded-lg bg-white"
      style={{ border: 0, height: hauteurInitiale, width: "100%" }}
    />
  );
}
