import BottomNavBar from "../../components/bottom-nav-bar";
import ProductAskCurator from "../../components/product-ask-curator";
import TopNavBar from "../../components/top-nav-bar";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNavBar />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-32 pt-24 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-12 gap-4">
            <div className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-low">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIILy1whUWcZQJDYJ10nsji5BP2t4fK_48Pbo5litFzw4uEi6Qk8iH2gCd6Zt5liV8BrMrYFmTqFT3Ymwh4QV7dpfSv7EN1EL2fURiR-lb3JP3K1nuz0LBJeN5ruP226MuouqG6t_aQA6_0Vw-BoZuNaDxI4_uN09xxaZOdpibvwpEA9ECQ6ur6E0aUfxONzdGBQeQx8ujI4n2drsmprM4DX5yaHQVFRZMY7JBgZOsZAnJmkqaECWcymjibddqrxcKIF0q3aPPrrk"
                alt="Running Tee"
              />
              <div className="absolute left-4 top-4">
                <span className="font-label rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
                  Best Seller
                </span>
              </div>
            </div>
            <div className="col-span-6 aspect-square overflow-hidden rounded-2xl bg-surface-container-low">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn1u5ICKY2Txfve-5l7uupFUTn90oGSdJO5Ur7afc_jsak34ai19T__lAlLfc4kjA8ixU6ZcLAOQ-grGdj1XViTaAIlHzWlZIzoXXdMLdS36HLAePnL-ioKTVlx4pJLICbEVWoxX8veHYOXgHWU3Dl7yi4HjhuGAXjFhKP0RR6MnIhnJlto3x_WK5YRg-MHqXiiU7Q-bKqwksRTfEzQK34cKMutUnEoCPL3Ev-uYpJtk6xb6r8k3Xo9nWzqJVZpI-1GAhRIetcK9A"
                alt="Fabric detail"
              />
            </div>
            <div className="col-span-6 aspect-square overflow-hidden rounded-2xl bg-surface-container-low">
              <img
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5rXATxx2ji1smlErgCwwPm3MKzpV3aRyIyAIfHHJmpGgD9hOiT6R_cHXiFprFf6nefF7Gwjxuw6nhb-GrprNzE-NiAFfUB4T2mlX9R_sO9vs_POZUy0rHrwhjJXBGoOCj8is1VLQNlNnEfm3u1VGQQ7QDrZs8S41ym7gH_yz-JVEH8LOIB8XDci9F9WsW1iz0LcsEbqDNbfBG4GrIjMZMuf_kIdA7dFfjHU7RVAzv0KmCM4XVuewRvLFnKPQBkDDkMoA8mfWYFk"
                alt="Styling context"
              />
            </div>
          </div>
        </div>

        <div className="h-fit space-y-8 lg:sticky lg:top-24 lg:col-span-5">
          <section className="space-y-4">
            <div className="space-y-1">
              <p className="font-label text-sm font-bold uppercase tracking-widest text-primary">
                Performance Series
              </p>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
                Apex Aero-Wick Tee
              </h1>
              <p className="font-headline text-2xl font-medium text-on-surface-variant">
                $68.00
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: "'FILL' 0.5" }}
                >
                  star_half
                </span>
              </div>
              <span className="text-sm font-medium text-outline">124 Reviews</span>
            </div>
            <p className="font-body leading-relaxed text-on-surface-variant">
              Designed for high-intensity endurance training. The Apex Tee
              features our signature 3D-knit topology that moves heat away from
              the body 40% faster than standard synthetics.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-sm font-bold uppercase tracking-wide">
                  Select Size
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant text-sm font-bold hover:bg-surface-container-low"
                >
                  S
                </button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary bg-primary-fixed text-sm font-bold text-on-primary-fixed"
                >
                  M
                </button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant text-sm font-bold hover:bg-surface-container-low"
                >
                  L
                </button>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-outline-variant text-sm font-bold hover:bg-surface-container-low"
                >
                  XL
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="font-headline flex-1 rounded-xl bg-gradient-to-br from-[#00668a] to-[#00a8e1] py-4 font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-95"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface-container-high text-on-surface transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </section>

          <ProductAskCurator />
        </div>
      </main>
      <BottomNavBar />
      <div className="fixed right-0 top-0 -z-10 h-1/2 w-1/3 bg-gradient-to-bl from-primary/5 to-transparent opacity-50 blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 h-1/3 w-1/4 bg-gradient-to-tr from-secondary/5 to-transparent opacity-30 blur-3xl" />
    </div>
  );
}
