import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPT, agentTools } from "@/lib/agent";

describe("SYSTEM_PROMPT", () => {
  it("defines the Curator AI persona", () => {
    expect(SYSTEM_PROMPT).toContain("Curator AI");
  });
});

describe("agentTools", () => {
  it("defines search_products and get_product_details tools", () => {
    expect(agentTools.search_products).toBeDefined();
    expect(agentTools.get_product_details).toBeDefined();
  });

  it("search_products execute returns products", async () => {
    const result = await agentTools.search_products.execute({ query: "running shoes" });
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("search_products filters by category", async () => {
    const result = await agentTools.search_products.execute({
      query: "shoes",
      category: "shoes",
    });
    result.products.forEach((p) => expect(p.category).toBe("shoes"));
  });

  it("get_product_details returns a product", async () => {
    const result = await agentTools.get_product_details.execute({
      product_id: "aero-mesh-tech-tee",
    });
    expect(result.name).toBe("Aero-Mesh Tech Tee");
  });

  it("get_product_details returns error for unknown product", async () => {
    const result = await agentTools.get_product_details.execute({
      product_id: "nonexistent",
    });
    expect(result.error).toBeDefined();
  });
});
