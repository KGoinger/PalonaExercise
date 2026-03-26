"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ProductCard from "./product-card";
import MarkdownContent from "./markdown-content";
import ImageUploadButton from "./image-upload-button";

function getMessageText(message) {
  return (message.parts || [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function getPreviousUserContext(messages, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    if (messages[i]?.role === "user") {
      const text = getMessageText(messages[i]);
      const hasImage = (messages[i].parts || []).some((part) => part.type === "file");
      return { text, hasImage };
    }
  }
  return { text: "", hasImage: false };
}

function dedupeProductsById(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product?.id) return true;
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function getToolProducts(message) {
  const toolParts = (message.parts || []).filter(
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

function formatPrice(price) {
  return typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";
}

function summarizeProduct(product) {
  const raw = (product?.description || "").replace(/\s+/g, " ").trim();
  if (!raw) return "General performance option from the catalog.";
  const sentence = raw.split(".").find((part) => part.trim().length > 0)?.trim() || raw;
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
}

function isComparisonIntent(text) {
  return /(compare|difference|different|vs|versus|trade[- ]?off|better)/i.test(
    text || ""
  );
}

function filterProductsForCurrentContext(products, options = {}) {
  const { currentProduct, userQuestion, hasImage } = options;
  if (!currentProduct) return products;

  if (hasImage || isComparisonIntent(userQuestion)) {
    const sameCategory = products.filter(
      (product) => product?.category === currentProduct.category
    );
    if (sameCategory.length > 0) return sameCategory;
  }

  return products;
}

function getFallbackRecommendationText(products, options = {}) {
  const { currentProduct, userQuestion, hasImage } = options;

  if (!products.length) {
    return "I couldn't confidently map this image to catalog items yet. Please try a more specific prompt such as \"find similar running tees\" or \"show tops like this\".";
  }

  if (currentProduct && (isComparisonIntent(userQuestion) || hasImage)) {
    const alternatives = products
      .filter((product) => product.id !== currentProduct.id)
      .slice(0, 3);

    if (alternatives.length > 0) {
      const lines = [
        hasImage
          ? `I analyzed your image against **${currentProduct.name}** (${formatPrice(
              currentProduct.price
            )}) and compared it with similar options in the same category:`
          : `I compared **${currentProduct.name}** (${formatPrice(
              currentProduct.price
            )}) with similar options from the catalog:`,
        "",
      ];

      alternatives.forEach((candidate, index) => {
        const priceDiff =
          typeof candidate.price === "number" &&
          typeof currentProduct.price === "number"
            ? candidate.price - currentProduct.price
            : null;

        const priceDiffText =
          priceDiff === null
            ? "Price difference unavailable."
            : priceDiff === 0
            ? "Same price."
            : priceDiff > 0
            ? `${formatPrice(priceDiff)} more expensive.`
            : `${formatPrice(Math.abs(priceDiff))} cheaper.`;

        lines.push(`${index + 1}. **${candidate.name}** (${formatPrice(candidate.price)})`);
        lines.push(`- Material/Fit profile: ${summarizeProduct(candidate)}`);
        lines.push(`- Compared with **${currentProduct.name}**: ${priceDiffText}`);
      });

      lines.push(
        "",
        "If you want, I can narrow this down by priority: breathability, warmth, fit, or budget."
      );
      return lines.join("\n");
    }
  }

  const top = products.slice(0, 3);
  const lines = [`I found **${products.length}** relevant options. Top matches:`, ""];
  top.forEach((candidate, index) => {
    lines.push(`${index + 1}. **${candidate.name}** (${formatPrice(candidate.price)})`);
    lines.push(`- ${summarizeProduct(candidate)}`);
  });
  lines.push("", "Tell me your fit and budget preference and I can refine further.");
  return lines.join("\n");
}

export default function ProductAskCurator({ product }) {
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { currentProductId: product?.id },
    }),
  });

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const isLoading = status === "submitted" || status === "streaming";
  const suggestions = useMemo(
    () => [
      `Is ${product?.name || "this product"} moisture-wicking?`,
      `Compare ${product?.name || "this product"} with similar options under $100.`,
    ],
    [product?.name]
  );

  function handleSubmit(event) {
    event.preventDefault();
    const question = input.trim();
    if ((!question && !pendingImage) || isLoading) return;

    const messagePayload = {
      text:
        question ||
        `Compare this image with ${product?.name || "the current product"} and suggest similar options.`,
    };

    if (pendingImage) {
      messagePayload.files = [
        {
          type: "file",
          mediaType: pendingImage.mediaType,
          url: pendingImage.data,
          filename: pendingImage.name,
        },
      ];
      setPendingImage(null);
    }

    sendMessage(messagePayload);
    setInput("");
  }

  return (
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

      {hasHydrated && messages.length === 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="rounded-full border border-outline-variant/25 bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-bright"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="hide-scrollbar max-h-[26rem] space-y-4 overflow-y-auto pr-1">
        {messages.map((message, index) => {
          const text = getMessageText(message);
          const files = (message.parts || []).filter((part) => part.type === "file");
          const userContext =
            message.role === "assistant"
              ? getPreviousUserContext(messages, index)
              : { text: "", hasImage: false };
          const rawToolProducts =
            message.role === "assistant" ? getToolProducts(message) : [];
          const toolProducts =
            message.role === "assistant"
              ? filterProductsForCurrentContext(rawToolProducts, {
                  currentProduct: product,
                  userQuestion: userContext.text,
                  hasImage: userContext.hasImage,
                })
              : [];

          if (message.role === "user") {
            return (
              <div key={message.id} className="flex flex-col items-end gap-2">
                {files.map((file, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className="max-w-[180px] overflow-hidden rounded-xl"
                  >
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
                {text && (
                  <div className="max-w-[85%] rounded-xl rounded-br-sm bg-primary px-4 py-2.5 text-sm font-body text-white">
                    {text}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={message.id} className="space-y-3">
              <div className="flex justify-start">
                <MarkdownContent
                  content={
                    text ||
                    getFallbackRecommendationText(toolProducts, {
                      currentProduct: product,
                      userQuestion: userContext.text,
                      hasImage: userContext.hasImage,
                    })
                  }
                  className="max-w-[88%] rounded-xl rounded-bl-sm border border-surface-variant/50 bg-surface-container-lowest px-4 py-2.5 text-sm font-body text-on-surface shadow-sm"
                />
              </div>

              {toolProducts.length > 0 && (
                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 hide-scrollbar">
                  {toolProducts.map((candidate) => (
                    <ProductCard key={candidate.id} product={candidate} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
            Curator is analyzing this product and alternatives...
          </div>
        )}
      </div>

      <form className="relative mt-4" onSubmit={handleSubmit}>
        {pendingImage && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-surface-container-lowest p-2 shadow-sm">
            <img
              src={pendingImage.preview}
              alt="Upload preview"
              className="h-14 w-14 rounded-lg object-cover"
            />
            <span className="flex-1 truncate text-xs text-on-surface-variant">
              {pendingImage.name}
            </span>
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="p-1 text-on-surface-variant hover:text-error"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        <div className="flex items-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-black/[0.04]">
          <ImageUploadButton
            onImageSelect={setPendingImage}
            disabled={isLoading}
          />
          <input
            className="flex-1 rounded-xl border-none bg-transparent py-2.5 px-2 text-sm focus:ring-0"
            placeholder="Ask about fit, material, compare options, or upload an image..."
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !pendingImage)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[22px] leading-none">
              arrow_upward
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
