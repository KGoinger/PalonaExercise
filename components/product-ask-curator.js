"use client";

import { useMemo, useState } from "react";

const INITIAL_MESSAGES = [
  { role: "user", text: "Is this moisture-wicking?" },
  {
    role: "assistant",
    text: "Yes, it uses Aero-Wick tech. It's specifically engineered to pull sweat to the outer layer for rapid evaporation.",
  },
];

function buildAssistantReply(question) {
  if (question.toLowerCase().includes("fit")) {
    return "The fit is athletic but not restrictive. If you prefer a relaxed look, consider sizing up.";
  }
  if (question.toLowerCase().includes("material")) {
    return "It uses lightweight performance synthetic fibers designed for breathability and fast drying.";
  }
  return "For this product, Aero-Wick tech is optimized for moisture management and comfort during high-intensity activity.";
}

export default function ProductAskCurator() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [question, setQuestion] = useState("");

  const canSend = useMemo(() => question.trim().length > 0, [question]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!canSend) return;

    const nextQuestion = question.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", text: nextQuestion },
      { role: "assistant", text: buildAssistantReply(nextQuestion) },
    ]);
    setQuestion("");
  };

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

      <div className="hide-scrollbar max-h-64 space-y-4 overflow-y-auto">
        {messages.map((message, index) =>
          message.role === "user" ? (
            <div key={index} className="flex justify-end">
              <div className="max-w-[85%] rounded-xl rounded-br-sm bg-primary px-4 py-2.5 text-sm font-body text-white">
                {message.text}
              </div>
            </div>
          ) : (
            <div key={index} className="flex justify-start">
              <div className="max-w-[85%] rounded-xl rounded-bl-sm border border-surface-variant/50 bg-surface-container-lowest px-4 py-2.5 text-sm font-body text-on-surface shadow-sm">
                {message.text}
              </div>
            </div>
          ),
        )}
      </div>

      <form className="relative mt-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-2xl border-none bg-white py-3 pl-4 pr-14 text-sm shadow-sm focus:ring-2 focus:ring-primary/20"
          placeholder="Ask about fit, material..."
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button
          type="submit"
          disabled={!canSend}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[22px] leading-none">
            arrow_upward
          </span>
        </button>
      </form>
    </div>
  );
}
