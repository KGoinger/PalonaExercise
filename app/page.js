import Link from "next/link";
import BottomNavBar from "../components/bottom-nav-bar";
import TopNavBar from "../components/top-nav-bar";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <TopNavBar />
      <main className="mx-auto flex w-full max-w-5xl flex-grow flex-col items-center justify-center px-6 py-12 pt-24">
        <section className="mb-16 space-y-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/15 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-xl">
            <span
              className="material-symbols-outlined text-sm text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Take-Home Exercise Prototype
            </span>
          </div>
          <h1 className="font-headline text-[2.8rem] font-extrabold leading-[0.96] tracking-[-0.03em] text-on-surface sm:text-6xl md:text-[6.1rem]">
            <span className="block">AI Agent for a</span>
            <span className="block bg-gradient-to-r from-primary via-[#00789f] to-primary-container bg-clip-text text-transparent">
              Commerce Website
            </span>
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg text-on-surface-variant md:text-xl">
            One unified assistant for general conversation, text-based product
            recommendation, and image-based product search over a predefined
            catalog.
          </p>
        </section>

        <section className="mb-16 grid w-full grid-cols-1 gap-6 md:auto-rows-fr md:grid-cols-3">
          <div className="landing-feature-card landing-reveal group relative flex h-full min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] p-8 md:col-span-2">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-white/60 blur-2xl" />
            <div className="relative z-10">
              <div className="landing-icon-float mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/15">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  forum
                </span>
              </div>
              <h3 className="font-headline mb-3 text-2xl font-bold">
                Conversational Stylist
              </h3>
              <p className="max-w-sm font-body leading-relaxed text-on-surface-variant">
                Just describe what you're looking for. "I need an outfit for a
                summer wedding in Tuscany" or "Find me jeans that fit like my
                favorite vintage pair."
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-[-12px] right-[-12px] opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.16]">
              <span className="material-symbols-outlined text-[180px]">
                forum
              </span>
            </div>
          </div>

          <div className="landing-feature-card landing-reveal landing-reveal-delay-1 relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[2rem] p-8">
            <div className="pointer-events-none absolute -right-14 -top-12 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/12 ring-1 ring-secondary/15">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                photo_camera
              </span>
            </div>
            <h3 className="font-headline mb-3 text-2xl font-bold">
              Visual Match
            </h3>
            <p className="font-body leading-relaxed text-on-surface-variant">
              Saw something you loved? Take a photo or upload a screenshot to
              find the exact item.
            </p>
          </div>
        </section>

        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#00668a] to-[#00a8e1] px-8 py-5 text-xl font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
            Start Chatting
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <p className="text-sm font-medium text-on-surface-variant">
            No subscription required. Always free to use.
          </p>
        </div>
      </main>
      <BottomNavBar />
      <div className="pointer-events-none fixed right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[100px]" />
    </div>
  );
}
