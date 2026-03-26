"use client";

import ProductCard from "./product-card";

function dedupeProductsById(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product?.id) return true;
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

export default function ChatMessage({ message }) {
  const parts = message.parts || [];
  const fallbackRecommendationText = (products) => {
    if (!products.length) return "";
    const names = products.slice(0, 3).map((p) => p.name).join(", ");
    return `I filtered ${products.length} options based on your request. Top picks: ${names}. Here are the specific items. Share your budget, terrain type, or size preference and I can narrow this down further.`;
  };

  if (message.role === "user") {
    // Extract text and file parts from the message
    const textParts = parts.filter((p) => p.type === "text");
    const fileParts = parts.filter((p) => p.type === "file");
    const textContent = textParts.map((p) => p.text).join("") || "";

    return (
      <div className="flex flex-col items-end gap-2">
        {fileParts.map((file, i) => (
          <div key={i} className="max-w-[200px] overflow-hidden rounded-xl">
            <img
              src={
                typeof file.url === "string" && file.url.startsWith("data:")
                  ? file.url
                  : `data:${file.mediaType};base64,${file.url}`
              }
              alt={file.filename || "Uploaded"}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {textContent && (
          <div className="max-w-[85%] rounded-bl-xl rounded-t-xl bg-primary px-6 py-4 text-lg text-on-primary md:max-w-[70%]">
            {textContent}
          </div>
        )}
      </div>
    );
  }

  // Assistant message — extract text and tool results from parts
  const textContent = parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  const toolProducts = dedupeProductsById(
    parts
      .filter(
        (p) =>
          p.type === "tool-search_products" &&
          p.state === "output-available" &&
          Array.isArray(p.output?.products)
      )
      .flatMap((p) => p.output.products)
  );

  return (
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
        {(textContent || toolProducts.length > 0) && (
          <p className="text-lg text-on-surface whitespace-pre-wrap">
            {textContent || fallbackRecommendationText(toolProducts)}
          </p>
        )}

        {toolProducts.length > 0 && (
          <div className="-mx-2 mt-4 flex gap-4 overflow-x-auto px-2 pb-4 hide-scrollbar">
            {toolProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
