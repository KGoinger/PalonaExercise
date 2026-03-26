import { describe, it, expect } from "vitest";
import { GET as listProducts } from "@/app/api/products/route";
import { GET as getProduct } from "@/app/api/products/[id]/route";

function makeRequest(url) {
  return new Request(url);
}

describe("GET /api/products", () => {
  it("returns all products with no query", async () => {
    const res = await listProducts(makeRequest("http://localhost/api/products"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
  });

  it("filters by search query", async () => {
    const res = await listProducts(
      makeRequest("http://localhost/api/products?q=running")
    );
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    const res = await listProducts(
      makeRequest("http://localhost/api/products?category=shoes")
    );
    const data = await res.json();
    data.products.forEach((p) => expect(p.category).toBe("shoes"));
  });
});

describe("GET /api/products/:id", () => {
  it("returns a product by ID", async () => {
    const res = await getProduct(makeRequest("http://localhost/api/products/aero-mesh-tech-tee"), {
      params: Promise.resolve({ id: "aero-mesh-tech-tee" }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.product.name).toBe("Aero-Mesh Tech Tee");
  });

  it("returns 404 for unknown product", async () => {
    const res = await getProduct(makeRequest("http://localhost/api/products/nope"), {
      params: Promise.resolve({ id: "nope" }),
    });
    expect(res.status).toBe(404);
  });
});
