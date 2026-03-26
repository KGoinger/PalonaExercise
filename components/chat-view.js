"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import TopNavBar from "./top-nav-bar";
import BottomNavBar from "./bottom-nav-bar";
import ChatMessage from "./chat-message";
import ImageUploadButton from "./image-upload-button";

export default function ChatView() {
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onSubmit(e) {
    e.preventDefault();
    if (!input.trim() && !pendingImage) return;

    const messagePayload = { text: input.trim() || "What products match this image?" };

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

  function onSuggestionClick(suggestion) {
    if (isLoading) return;
    sendMessage({ text: suggestion });
    setInput("");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNavBar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-60 pt-20 md:pb-44">
        <div className="flex flex-1 flex-col gap-10 py-8">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-lg">
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                </svg>
              </div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                Hi! I'm Curator AI
              </h2>
              <p className="max-w-md text-on-surface-variant">
                I can help you find the perfect gear. Describe what you're looking
                for, or upload an image to find matching products.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {[
                  "Recommend a running outfit",
                  "I need trail running shoes",
                  "What's good for cold weather?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onSuggestionClick(suggestion)}
                    className="rounded-full border border-outline-variant/30 px-4 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-sm">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                  </svg>
                </div>
                <span className="font-headline text-sm font-bold tracking-tight text-on-surface-variant">
                  Curator AI is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Chat Input */}
      <div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-0 z-40 w-full px-4 md:bottom-8">
        <div className="pointer-events-auto mx-auto w-full max-w-4xl">
          {pendingImage && (
            <div className="mb-2 flex items-center gap-2 rounded-xl bg-surface-container-lowest p-2 shadow-md">
              <img
                src={pendingImage.preview}
                alt="Upload preview"
                className="h-16 w-16 rounded-lg object-cover"
              />
              <span className="flex-1 truncate text-sm text-on-surface-variant">
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
          <form onSubmit={onSubmit}>
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary to-primary-container opacity-20 blur transition duration-500 group-focus-within:opacity-40" />
              <div className="relative flex items-center rounded-2xl bg-surface-container-lowest p-2 shadow-xl ring-1 ring-black/[0.05]">
                <ImageUploadButton
                  onImageSelect={setPendingImage}
                  disabled={isLoading}
                />
                <input
                  className="flex-1 border-none bg-transparent px-2 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0"
                  placeholder="Describe what you're looking for..."
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <div className="flex items-center gap-2 pr-2">
                  <button
                    type="submit"
                    disabled={isLoading || (!input.trim() && !pendingImage)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-container text-white shadow-lg shadow-primary/25 transition-transform active:scale-90 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
}
