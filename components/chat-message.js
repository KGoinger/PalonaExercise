"use client";

import ProductCard from "./product-card";

export default function ChatMessage({ message }) {
  if (message.role === "user") {
    const imageParts = message.experimental_attachments || [];
    const textContent =
      typeof message.content === "string"
        ? message.content
        : message.content;

    return (
      <div className="flex flex-col items-end gap-2">
        {imageParts.map((att, i) => (
          <div key={i} className="max-w-[200px] overflow-hidden rounded-xl">
            <img
              src={att.url}
              alt="Uploaded"
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

  // Assistant message — extract product results from toolInvocations
  const toolProducts = (message.toolInvocations || [])
    .filter(
      (inv) =>
        inv.toolName === "search_products" &&
        inv.state === "result" &&
        inv.result?.products
    )
    .flatMap((inv) => inv.result.products);

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
        {message.content && (
          <p className="text-lg text-on-surface whitespace-pre-wrap">
            {message.content}
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
