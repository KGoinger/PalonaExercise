import TopNavBar from "../../components/top-nav-bar";
import BottomNavBar from "../../components/bottom-nav-bar";
import ProductCard from "../../components/product-card";
import { searchProducts } from "@/lib/catalog";

export default function ProductPage() {
  const products = searchProducts();

  return (
    <div className="min-h-screen bg-surface">
      <TopNavBar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-32 pt-24">
        <section className="mb-8 space-y-3">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            Shop
          </h1>
          <p className="max-w-2xl text-on-surface-variant">
            Explore performance essentials selected by Curator AI.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
}
