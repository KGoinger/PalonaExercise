import Link from "next/link";

export default function ProductCard({
  product,
  className = "",
  variant = "default",
}) {
  const isCompact = variant === "compact";

  return (
    <div
      className={[
        "group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest transition-all duration-300 hover:bg-surface-bright",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden rounded-[inherit]",
          isCompact ? "aspect-[4/3] bg-surface-container-lowest" : "aspect-[4/5]",
        ].join(" ")}
      >
        <img
          className={[
            "h-full w-full rounded-[inherit] transition-transform duration-500",
            isCompact
              ? "object-cover group-hover:scale-105"
              : "object-cover group-hover:scale-110",
          ].join(" ")}
          src={product.image}
          alt={product.name}
          style={{ objectPosition: product.imagePosition || "center" }}
        />
        {product.badge && (
          <div
            className={[
              "absolute left-3 top-3 rounded-md bg-secondary-container font-bold uppercase tracking-wider text-on-secondary-container",
              isCompact ? "left-2 top-2 px-2 py-1 text-[9px]" : "px-2 py-1 text-[10px]",
            ].join(" ")}
          >
            {product.badge}
          </div>
        )}
      </div>
      <div className={["flex flex-1 flex-col gap-1", isCompact ? "p-3" : "p-4"].join(" ")}>
        <h4
          className={[
            "font-headline font-bold text-on-surface",
            isCompact ? "text-[13px] leading-snug" : "text-sm",
          ].join(" ")}
        >
          {product.name}
        </h4>
        <p className={["font-bold text-primary", isCompact ? "text-base" : "text-lg"].join(" ")}>
          ${product.price.toFixed(2)}
        </p>
        <Link
          href={`/product/${product.id}`}
          className={[
            "mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high font-semibold text-on-surface transition-colors hover:bg-surface-container-highest",
            isCompact ? "py-2 text-[11px]" : "py-2.5 text-xs",
          ].join(" ")}
        >
          View Details
          <span
            className={[
              "material-symbols-outlined",
              isCompact ? "text-[16px]" : "text-sm",
            ].join(" ")}
          >
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
