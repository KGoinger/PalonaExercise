import { tool } from "ai";
import { z } from "zod";
import { searchProducts, getProductById } from "@/lib/catalog";

export const SYSTEM_PROMPT = `You are Curator AI, a friendly and knowledgeable personal shopping assistant for an athletic and lifestyle apparel store.

Your capabilities:
1. **General conversation** — Answer questions about yourself, greet users, explain what you can do.
2. **Product recommendations** — Search the catalog based on the user's needs (activity, style, occasion, weather) and recommend the best matches with explanations.
3. **Visual product search** — When a user shares an image, analyze it to identify clothing items, style, colors, and type, then search the catalog for similar products.

Guidelines:
- Always search the product catalog before making recommendations. Never invent products.
- When recommending products, explain WHY each product fits the user's needs.
- Keep responses conversational and concise — like a helpful store associate, not a product database.
- If no products match, say so honestly and suggest related categories.
- For image searches, describe what you see in the image first, then search for matching items.
- You can recommend multiple products (up to 4) when relevant.`;

export const agentTools = {
  search_products: tool({
    description:
      "Search the product catalog by text query and/or category. Use this to find products matching the user's request.",
    parameters: z.object({
      query: z
        .string()
        .describe("Search terms to match against product names, descriptions, and tags."),
      category: z
        .enum(["tops", "bottoms", "shoes", "accessories"])
        .optional()
        .describe("Optional category filter."),
    }),
    execute: async ({ query, category }) => {
      const products = searchProducts({ q: query, category });
      return {
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          description: p.description.slice(0, 120) + "...",
          rating: p.rating,
          image: p.image,
          badge: p.badge,
        })),
        total: products.length,
      };
    },
  }),

  get_product_details: tool({
    description:
      "Get full details for a specific product by its ID. Use when the user asks about a specific product.",
    parameters: z.object({
      product_id: z.string().describe("The product ID to look up."),
    }),
    execute: async ({ product_id }) => {
      const product = getProductById(product_id);
      if (!product) {
        return { error: `Product "${product_id}" not found in catalog.` };
      }
      return product;
    },
  }),
};
