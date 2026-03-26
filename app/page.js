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
              Personalized Commerce Agent
            </span>
          </div>
          <h1 className="font-headline text-5xl font-extrabold leading-[1.1] tracking-tighter text-on-surface md:text-7xl">
            Your closet, <br />
            <span className="italic text-primary">reimagined</span> by AI.
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg text-on-surface-variant md:text-xl">
            Curator AI understands your taste, finds the perfect fit, and helps
            you build a wardrobe that actually works for you.
          </p>
        </section>

        <section className="mb-16 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm md:col-span-2">
            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
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
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10 transition-opacity group-hover:opacity-20">
              <span className="material-symbols-outlined text-[200px]">
                forum
              </span>
            </div>
          </div>

          <div className="flex min-h-[320px] flex-col rounded-[2rem] border border-outline-variant/10 bg-surface-container-low p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
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
            <div className="mt-auto pt-6">
              <div className="h-24 w-full overflow-hidden rounded-xl bg-surface-container-high">
                <img
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzpW3gUwuC0gFDsmGrnzfXide79JX2KBGHqTYATUVOIcMWHWmBExSFCwkiIyMsQxrhgQYC2FRePPlQpsCVs37qWreYIQuNDglRtVk18z4_14wIu9DhC-iZBLGYZhMWFo4HHvVfqMoc2tEi0jizIWrqeNgwMMdLFLuj-gcU0quJxXTI14KrB6f2vgQDL_srfsd6SnvnL6F6eHISrIZ0gLZewxvPQXxuz9BG9Lvx-re473AkfPX1RPovek83UpP6cpeQyWs5h5CLCZY"
                  alt="Visual search"
                />
              </div>
            </div>
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
