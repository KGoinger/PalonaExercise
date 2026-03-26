import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/catalog";
import TopNavBar from "../../../components/top-nav-bar";
import BottomNavBar from "../../../components/bottom-nav-bar";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface">
      <TopNavBar />
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-32 pt-24 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-12 gap-4">
            <div className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-low">
              <img
                className="h-full w-full object-cover"
                src={product.image}
                alt={product.name}
              />
              {product.badge && (
                <div className="absolute left-4 top-4">
                  <span className="font-label rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-secondary-container">
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-fit space-y-8 lg:sticky lg:top-24 lg:col-span-5">
          <section className="space-y-4">
            <div className="space-y-1">
              <p className="font-label text-sm font-bold uppercase tracking-widest text-primary">
                {product.category}
              </p>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
                {product.name}
              </h1>
              <p className="font-headline text-2xl font-medium text-on-surface-variant">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-secondary"
                    style={{
                      fontVariationSettings: `'FILL' ${
                        i < Math.floor(product.rating)
                          ? 1
                          : i < product.rating
                          ? 0.5
                          : 0
                      }`,
                    }}
                  >
                    {i < Math.floor(product.rating)
                      ? "star"
                      : i < product.rating
                      ? "star_half"
                      : "star"}
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-outline">
                {product.reviewCount} Reviews
              </span>
            </div>

            <p className="font-body leading-relaxed text-on-surface-variant">
              {product.description}
            </p>

            <div className="space-y-3">
              <span className="font-headline text-sm font-bold uppercase tracking-wide">
                Select Size
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="flex h-12 min-w-[3rem] items-center justify-center rounded-xl border border-outline-variant px-3 text-sm font-bold hover:bg-surface-container-low"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="font-headline text-sm font-bold uppercase tracking-wide">
                  Colors
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-outline-variant/30 px-3 py-1.5 text-xs font-medium text-on-surface-variant"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

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

          {/* Ask Curator inline chat link */}
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-6 ring-1 ring-outline-variant/15">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container shadow-md">
                <span className="material-symbols-outlined text-xl text-white">
                  smart_toy
                </span>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold">Ask Curator</h3>
                <p className="text-[11px] font-medium text-outline">
                  Instant Product Intelligence
                </p>
              </div>
            </div>
            <Link
              href="/chat"
              className="block w-full rounded-2xl border-none bg-white py-3 pl-4 pr-12 text-left text-sm text-on-surface-variant/60 shadow-sm transition-colors hover:bg-surface-container-low"
            >
              Ask about fit, material...
            </Link>
          </div>
        </div>
      </main>
      <BottomNavBar />
      <div className="fixed right-0 top-0 -z-10 h-1/2 w-1/3 bg-gradient-to-bl from-primary/5 to-transparent opacity-50 blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 h-1/3 w-1/4 bg-gradient-to-tr from-secondary/5 to-transparent opacity-30 blur-3xl" />
    </div>
  );
}
