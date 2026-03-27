import { describe, expect, it } from "vitest";
import {
  getStreamingAssistantId,
  isAssistantMessageThinking,
} from "@/lib/chat-message-state";

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

describe("getStreamingAssistantId", () => {
  it("returns the latest assistant id while streaming", () => {
    expect(
      getStreamingAssistantId(
        [
          { id: "u1", role: "user" },
          { id: "a1", role: "assistant" },
        ],
        "streaming"
      )
    ).toBe("a1");
  });

  it("does not mark the previous assistant as streaming during submitted state", () => {
    expect(
      getStreamingAssistantId(
        [
          { id: "u1", role: "user" },
          { id: "a1", role: "assistant" },
          { id: "u2", role: "user" },
        ],
        "submitted"
      )
    ).toBeNull();
  });

  it("does not mark any assistant as streaming when the latest message is from the user", () => {
    expect(
      getStreamingAssistantId(
        [
          { id: "u1", role: "user" },
          { id: "a1", role: "assistant" },
          { id: "u2", role: "user" },
        ],
        "streaming"
      )
    ).toBeNull();
  });
});
