import { describe, it, expect } from "vitest";
import {
  searchProducts,
  getProductById,
  getCategories,
  inferCategoryFromText,
} from "@/lib/catalog";

describe("searchProducts", () => {
  it("returns all products when no query is given", () => {
    const results = searchProducts({});
    expect(results.length).toBeGreaterThan(0);
  });

  it("filters by text query matching name or description", () => {
    const results = searchProducts({ q: "running" });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      const text = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      expect(text).toContain("run");
    });
  });

  it("filters by category", () => {
    const results = searchProducts({ category: "tops" });
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.category).toBe("tops");
    });
  });

  it("combines text query and category filter", () => {
    const results = searchProducts({ q: "running", category: "tops" });
    results.forEach((p) => {
      expect(p.category).toBe("tops");
    });
  });

  it("returns empty array for no matches", () => {
    const results = searchProducts({ q: "xyznonexistent" });
    expect(results).toEqual([]);
  });

  it("prioritizes shoe category queries to shoe products", () => {
    const results = searchProducts({ q: "shoes" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].category).toBe("shoes");
  });
});

describe("getProductById", () => {
  it("returns a product by ID", () => {
    const product = getProductById("aero-mesh-tech-tee");
    expect(product).toBeDefined();
    expect(product.name).toBe("Aero-Mesh Tech Tee");
  });

  it("returns undefined for unknown ID", () => {
    expect(getProductById("nonexistent")).toBeUndefined();
  });
});

describe("getCategories", () => {
  it("returns unique category list", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});

describe("inferCategoryFromText", () => {
  it("infers shoes from user text", () => {
    expect(inferCategoryFromText("I need trail running shoes")).toBe("shoes");
  });

  it("returns undefined when no product type keyword exists", () => {
    expect(inferCategoryFromText("I need something for rainy weather")).toBeUndefined();
  });
});
