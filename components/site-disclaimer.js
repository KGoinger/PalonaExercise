"use client";

import { usePathname } from "next/navigation";

export default function SiteDisclaimer() {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-low/50">
      <div className="mx-auto max-w-7xl px-6 py-3 text-center text-xs text-on-surface-variant">
        Demo use only (non-commercial). Product images are sourced from
        third-party platforms, and all copyrights remain with their respective
        owners.
      </div>
    </footer>
  );
}
