"use client";

import { memo } from "react";
import ProductCard from "./product-card";
import MarkdownContent from "./markdown-content";
import { extractProductCardsFromParts } from "@/lib/chat-products";
import { isAssistantMessageThinking } from "@/lib/chat-message-state";
import { sanitizeAssistantDisplayText } from "@/lib/chat-display";

function ChatMessage({ message, isStreaming = false }) {
  const parts = message.parts || [];
  const resolveFileSource = (file) => {
    if (!file?.url) return "";
    if (typeof file.url !== "string") return "";
    if (
      file.url.startsWith("data:") ||
      file.url.startsWith("http://") ||
      file.url.startsWith("https://") ||
      file.url.startsWith("blob:")
    ) {
      return file.url;
    }
    return `data:${file.mediaType};base64,${file.url}`;
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
              src={resolveFileSource(file)}
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
  const displayText = sanitizeAssistantDisplayText(textContent);

  const showThinkingState = isAssistantMessageThinking(parts, textContent);
  const toolProducts =
    !isStreaming && textContent.trim().length > 0
      ? extractProductCardsFromParts(parts, textContent)
      : [];
  const hasVisibleContent =
    showThinkingState || displayText.trim().length > 0 || toolProducts.length > 0;

  if (!hasVisibleContent) {
    return null;
  }

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
        {showThinkingState && (
          <div className="flex items-center gap-3 text-on-surface-variant">
            <svg
              className="h-4 w-4 animate-spin"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
            </svg>
            <span className="font-headline text-sm font-bold tracking-tight">
              Curator AI is thinking...
            </span>
          </div>
        )}

        {displayText.trim().length > 0 && (
          <MarkdownContent
            content={displayText}
            className="text-lg text-on-surface"
          />
        )}

        {!showThinkingState && toolProducts.length > 0 && (
          <div className="-mx-2 mt-4 flex gap-4 overflow-x-auto px-2 pb-4 hide-scrollbar">
            {toolProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="compact"
                className="w-[156px] shrink-0"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ChatMessage);
