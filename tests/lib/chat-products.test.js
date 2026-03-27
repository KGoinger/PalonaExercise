import { describe, expect, it } from "vitest";
import { extractProductCardsFromParts } from "@/lib/chat-products";

describe("extractProductCardsFromParts", () => {
  it("returns category-scoped products for a simple recommendation tool result", () => {
    const products = extractProductCardsFromParts(
      [
        {
          type: "tool-search_products",
          state: "output-available",
          output: {
            appliedCategory: "tops",
            products: [
              { id: "aero-mesh-tech-tee", name: "Aero-Mesh Tech Tee" },
              { id: "stealth-run-crew", name: "Stealth Run Crew" },
            ],
          },
        },
      ],
      "Here are two strong options."
    );

    expect(products.map((product) => product.id)).toEqual([
      "aero-mesh-tech-tee",
      "stealth-run-crew",
    ]);
  });

  it("surfaces products explicitly mentioned in the assistant text for broad outfit searches", () => {
    const products = extractProductCardsFromParts(
      [
        {
          type: "tool-search_products",
          state: "output-available",
          output: {
            appliedCategory: null,
            products: [
              { id: "apex-aero-wick-tee", name: "Apex Aero-Wick Tee" },
              { id: "stride-flex-shorts", name: "Stride Flex Shorts" },
              { id: "cloudstrike-runner", name: "CloudStrike Runner" },
              { id: "compression-socks", name: "EnduroGrip Compression Socks" },
              { id: "urban-flex-polo", name: "Urban Flex Polo" },
            ],
          },
        },
      ],
      `A high-performance running outfit needs to balance breathability and support.

1. Apex Aero-Wick Tee
2. Stride Flex Shorts
3. CloudStrike Runner
4. EnduroGrip Compression Socks`
    );

    expect(products.map((product) => product.id)).toEqual([
      "apex-aero-wick-tee",
      "stride-flex-shorts",
      "cloudstrike-runner",
      "compression-socks",
    ]);
  });
});
