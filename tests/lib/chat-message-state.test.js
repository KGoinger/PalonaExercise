import { describe, expect, it } from "vitest";
import { isAssistantMessageThinking } from "@/lib/chat-message-state";

describe("isAssistantMessageThinking", () => {
  it("returns true while tool calls are in progress and no text has arrived", () => {
    expect(
      isAssistantMessageThinking(
        [
          { type: "step-start" },
          { type: "tool-search_products", state: "input-streaming" },
        ],
        ""
      )
    ).toBe(true);
  });

  it("returns false once assistant text exists", () => {
    expect(
      isAssistantMessageThinking(
        [
          { type: "step-start" },
          { type: "tool-search_products", state: "output-available" },
          { type: "text", text: "Here are the best options." },
        ],
        "Here are the best options."
      )
    ).toBe(false);
  });
});
