"use client";

import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ProductCard from "./product-card";
import MarkdownContent from "./markdown-content";
import ImageUploadButton from "./image-upload-button";
import { extractProductCardsFromParts } from "@/lib/chat-products";
import { isAssistantMessageThinking } from "@/lib/chat-message-state";

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

function getToolProducts(message, text) {
  return extractProductCardsFromParts(message.parts || [], text);
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
    return "";
  }

  if (currentProduct && (isComparisonIntent(userQuestion) || hasImage)) {
    return "";
  }

  return "";
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
            message.role === "assistant" ? getToolProducts(message, text) : [];
          const toolProducts =
            message.role === "assistant"
              ? filterProductsForCurrentContext(rawToolProducts, {
                  currentProduct: product,
                  userQuestion: userContext.text,
                  hasImage: userContext.hasImage,
                })
              : [];
          const showThinkingState =
            message.role === "assistant"
              ? isAssistantMessageThinking(message.parts || [], text)
              : false;

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
              {(showThinkingState || text || toolProducts.length === 0) && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-xl rounded-bl-sm border border-surface-variant/50 bg-surface-container-lowest px-4 py-2.5 text-sm font-body text-on-surface shadow-sm">
                    {showThinkingState ? (
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined animate-spin text-base">
                          progress_activity
                        </span>
                        <span className="text-xs font-semibold">
                          Curator AI is thinking...
                        </span>
                      </div>
                    ) : (
                      <MarkdownContent
                        content={
                          text ||
                          getFallbackRecommendationText(toolProducts, {
                            currentProduct: product,
                            userQuestion: userContext.text,
                            hasImage: userContext.hasImage,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {!showThinkingState && toolProducts.length > 0 && (
                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 hide-scrollbar">
                  {toolProducts.map((candidate) => (
                    <ProductCard
                      key={candidate.id}
                      product={candidate}
                      className="w-[220px] shrink-0"
                    />
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
