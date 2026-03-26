import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="group min-w-[220px] overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300 hover:bg-surface-bright">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <img
          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />
        {product.badge && (
          <div className="absolute left-3 top-3 rounded-md bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
            {product.badge}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h4 className="font-headline text-sm font-bold text-on-surface">
          {product.name}
        </h4>
        <p className="text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-highest"
        >
          View Details
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
