import Link from "next/link";
import BottomNavBar from "../../components/bottom-nav-bar";
import TopNavBar from "../../components/top-nav-bar";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNavBar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-60 pt-20 md:pb-44">
        <div className="flex flex-1 flex-col gap-10 py-8">
          <div className="flex flex-col items-end gap-2">
            <div className="max-w-[85%] rounded-bl-xl rounded-t-xl bg-primary px-6 py-4 text-lg text-on-primary md:max-w-[70%]">
              I need some high-performance t-shirts for outdoor running.
              Something breathable and stylish.
            </div>
            <span className="px-2 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
              10:42 AM
            </span>
          </div>

          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-sm">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                </svg>
              </div>
              <span className="font-headline text-sm font-bold tracking-tight">
                Curator AI Assistant
              </span>
            </div>
            <div className="max-w-[90%] rounded-b-xl rounded-tr-xl border border-outline-variant/15 bg-surface-container-lowest px-6 py-5 leading-relaxed shadow-sm md:max-w-[80%]">
              <p className="mb-4 text-lg text-on-surface">
                Absolutely. For outdoor running, you want moisture-wicking
                fabrics with flatlock seams to prevent chafing. I've curated a
                few options that blend tech performance with a clean, modern
                aesthetic.
              </p>

              <div className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-4 hide-scrollbar">
                <div className="group min-w-[240px] overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300 hover:bg-surface-bright">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzpW3gUwuC0gFDsmGrnzfXide79JX2KBGHqTYATUVOIcMWHWmBExSFCwkiIyMsQxrhgQYC2FRePPlQpsCVs37qWreYIQuNDglRtVk18z4_14wIu9DhC-iZBLGYZhMWFo4HHvVfqMoc2tEi0jizIWrqeNgwMMdLFLuj-gcU0quJxXTI14KrB6f2vgQDL_srfsd6SnvnL6F6eHISrIZ0gLZewxvPQXxuz9BG9Lvx-re473AkfPX1RPovek83UpP6cpeQyWs5h5CLCZY"
                      alt="Aero-Mesh Tech Tee"
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
                      Top Pick
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h4 className="font-headline text-sm font-bold text-on-surface">
                      Aero-Mesh Tech Tee
                    </h4>
                    <p className="text-lg font-bold text-primary">$45.00</p>
                    <Link
                      href="/product"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="group min-w-[240px] overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300 hover:bg-surface-bright">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMaJ55r5aqcd-di87JTDT3b8U1YL97P9VFBOAawlqBfw7qS_QTX756Lh1UdXtOQthTiaw7g31L-YA1IxmrLroIdXSzbd2SIq7CszJU25t5XZKol9yPpEmglwH24gmUGv_-mWAZVhxFWhxpJwkNoMdh-LPXkbQPzuoehoF8kpIetxUZ8BDHGYJjEwzOAtUlSm3kftVTs9U4Vyat6DFEGkI5aR-Zqiadj_oiiW00lPkp9rrLz6lTVXU8WGAcYb-lNij1U7VvDstobWU"
                      alt="Stealth Run Crew"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h4 className="font-headline text-sm font-bold text-on-surface">
                      Stealth Run Crew
                    </h4>
                    <p className="text-lg font-bold text-primary">$38.00</p>
                    <Link
                      href="/product"
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
                    >
                      View Details
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <span className="ml-10 px-2 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
              10:43 AM
            </span>
          </div>

          <div className="flex flex-wrap gap-2 md:ml-12">
            <button
              type="button"
              className="rounded-full border border-outline-variant/30 px-4 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Compare fabric tech
            </button>
            <button
              type="button"
              className="rounded-full border border-outline-variant/30 px-4 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Find matching shorts
            </button>
            <button
              type="button"
              className="rounded-full border border-outline-variant/30 px-4 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Show more colors
            </button>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-0 z-40 w-full px-4 md:bottom-8">
        <div className="pointer-events-auto mx-auto w-full max-w-4xl">
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary to-primary-container opacity-20 blur transition duration-500 group-focus-within:opacity-40" />
            <div className="relative flex items-center rounded-2xl bg-surface-container-lowest p-2 shadow-xl ring-1 ring-black/[0.05]">
              <button
                type="button"
                className="p-3 text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined">add_circle</span>
              </button>
              <button
                type="button"
                className="p-3 text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined">image</span>
              </button>
              <input
                className="flex-1 border-none bg-transparent px-2 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0"
                placeholder="Describe what you're looking for..."
                type="text"
              />
              <div className="flex items-center gap-2 pr-2">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/25 transition-transform active:scale-90"
                >
                  <span className="material-symbols-outlined">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
