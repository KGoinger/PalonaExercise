"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#bdc8d0]/15 bg-white/80 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-4px_32px_rgba(27,28,28,0.06)] backdrop-blur-xl dark:bg-slate-950/80 md:hidden">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-all duration-300 ${
          pathname === "/"
            ? "text-primary"
            : "text-[#1b1c1c]/50 dark:text-slate-500"
        }`}
      >
        <span className="material-symbols-outlined">explore</span>
        <span className="mt-1 text-[11px] font-medium">Discover</span>
      </Link>

      <button
        type="button"
        className="flex flex-col items-center justify-center text-[#1b1c1c]/50 transition-all duration-300 hover:text-[#00668a] dark:text-slate-500"
      >
        <span className="material-symbols-outlined">search</span>
        <span className="mt-1 text-[11px] font-medium">Search</span>
      </button>

      <Link
        href="/chat"
        className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#00668a] to-[#00a8e1] px-4 py-1.5 text-white transition-all duration-300"
      >
        <svg
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
        </svg>
        <span className="mt-1 text-[11px] font-medium">Chat</span>
      </Link>

      <button
        type="button"
        className="flex flex-col items-center justify-center text-[#1b1c1c]/50 transition-all duration-300 hover:text-[#00668a] dark:text-slate-500"
      >
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="mt-1 text-[11px] font-medium">Cart</span>
      </button>

      <button
        type="button"
        className="flex flex-col items-center justify-center text-[#1b1c1c]/50 transition-all duration-300 hover:text-[#00668a] dark:text-slate-500"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="mt-1 text-[11px] font-medium">Profile</span>
      </button>
    </nav>
  );
}
