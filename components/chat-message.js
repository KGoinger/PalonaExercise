"use client";

import ProductCard from "./product-card";
import MarkdownContent from "./markdown-content";

function dedupeProductsById(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product?.id) return true;
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function extractDisplayedToolProducts(parts) {
  const toolParts = (parts || []).filter(
    (part) =>
      part.type === "tool-search_products" &&
      part.state === "output-available" &&
      Array.isArray(part.output?.products)
  );

  if (!toolParts.length) return [];

  const partsWithProducts = toolParts.filter(
    (part) => (part.output?.products || []).length > 0
  );

  if (!partsWithProducts.length) return [];

  const withCategory = partsWithProducts.filter(
    (part) =>
      typeof part.output?.appliedCategory === "string" &&
      part.output.appliedCategory.length > 0
  );

  const candidatePool = withCategory.length > 0 ? withCategory : partsWithProducts;

  const preferredPart = candidatePool.reduce((best, current) => {
    const bestLen = (best.output?.products || []).length;
    const currentLen = (current.output?.products || []).length;
    return currentLen < bestLen ? current : best;
  }, candidatePool[0]);

  const preferredProducts = dedupeProductsById(preferredPart.output?.products || []);
  const hasCategory =
    typeof preferredPart.output?.appliedCategory === "string" &&
    preferredPart.output.appliedCategory.length > 0;

  if (!hasCategory && preferredProducts.length >= 10) {
    return [];
  }

  return preferredProducts;
}

export default function ChatMessage({ message }) {
  const parts = message.parts || [];
  const formatPrice = (price) =>
    typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";
  const summarizeProduct = (product) => {
    const raw = (product?.description || "").replace(/\s+/g, " ").trim();
    if (!raw) return "General performance option from the catalog.";
    const sentence = raw.split(".").find((part) => part.trim().length > 0)?.trim() || raw;
    return sentence.endsWith(".") ? sentence : `${sentence}.`;
  };
  const fallbackRecommendationText = (products) => {
    if (!products.length) {
      return "I couldn't confidently map this image to catalog items yet. Please try a more specific prompt such as \"find similar running tees\" or \"find this exact shirt type\".";
    }
    const top = products.slice(0, 3);
    const lines = [`I found **${products.length}** relevant options. Top matches:`, ""];
    top.forEach((candidate, index) => {
      lines.push(`${index + 1}. **${candidate.name}** (${formatPrice(candidate.price)})`);
      lines.push(`- ${summarizeProduct(candidate)}`);
    });
    lines.push("", "Share your fit and budget preference and I can refine this further.");
    return lines.join("\n");
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

  const toolProducts = extractDisplayedToolProducts(parts);

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
        <MarkdownContent
          content={textContent || fallbackRecommendationText(toolProducts)}
          className="text-lg text-on-surface"
        />

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
