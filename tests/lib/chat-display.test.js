import { describe, expect, it } from "vitest";
import { sanitizeAssistantDisplayText } from "@/lib/chat-display";

describe("sanitizeAssistantDisplayText", () => {
  it("removes standalone UI-only view product lines", () => {
    const text = [
      "I recommend the CloudStrike Runner for daily mileage.",
      "",
      "View Details",
      "View Product",
      "",
      "It balances cushioning and responsiveness well.",
    ].join("\n");

    expect(sanitizeAssistantDisplayText(text)).toBe(
      [
        "I recommend the CloudStrike Runner for daily mileage.",
        "",
        "It balances cushioning and responsiveness well.",
      ].join("\n")
    );
  });

  it("preserves normal recommendation prose", () => {
    const text = "Viewability matters less here than breathability and comfort.";
    expect(sanitizeAssistantDisplayText(text)).toBe(text);
  });
});
