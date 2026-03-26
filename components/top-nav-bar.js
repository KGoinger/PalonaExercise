"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNavBar() {
  const pathname = usePathname();
  const isShopActive = pathname.startsWith("/product");
  const isMyAgentActive = pathname.startsWith("/chat");

  const navItemClass = (isActive) =>
    `rounded-lg px-3 py-1 font-semibold ${
      isActive
        ? "text-[#00668a] dark:text-[#00a8e1]"
        : "text-[#1b1c1c]/60 transition-colors hover:bg-[#f5f3f3] dark:text-slate-400 dark:hover:bg-slate-900"
    }`;

  return (
    <header className="fixed top-0 z-50 w-full bg-[#fbf9f8] dark:bg-slate-950">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-headline text-xl font-black tracking-tight text-[#1b1c1c] dark:text-slate-100"
          >
            Curator AI
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/product" className={navItemClass(isShopActive)}>
              Shop
            </Link>
            <Link href="/chat" className={navItemClass(isMyAgentActive)}>
              My Agent
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-[#f5f3f3]"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-[#f5f3f3]"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
