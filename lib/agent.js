import { tool } from "ai";
import { z } from "zod";
import { inferCategoryFromText, searchProducts, getProductById } from "@/lib/catalog";

export const SYSTEM_PROMPT = `You are Curator AI, a friendly and knowledgeable personal shopping assistant for an athletic and lifestyle apparel store.

Your capabilities:
1. **General conversation** — Answer questions about yourself, greet users, explain what you can do.
2. **Product recommendations** — Search the catalog based on the user's needs (activity, style, occasion, weather) and recommend the best matches with explanations.
3. **Visual product search** — When a user shares an image, analyze it to identify clothing items, style, colors, and type, then search the catalog for similar products.

Guidelines:
- Always respond in English unless the user explicitly asks for another language.
- Always search the product catalog before making recommendations. Never invent products.
- When user intent clearly specifies a product type (e.g., shoes, tops, bottoms, accessories), use the matching category in search_products and do not mix unrelated categories.
- When recommending products, explain WHY each product fits the user's needs.
- For any recommendation request, always include a short textual explanation first, then present product suggestions.
- Never return only product/tool results without a natural-language explanation.
- Keep responses conversational and concise — like a helpful store associate, not a product database.
- If no products match, say so honestly and suggest related categories.
- For image searches, describe what you see in the image first, then search for matching items.
- You can recommend multiple products (up to 4) when relevant.`;

function formatCurrentProductContext(product) {
  if (!product) return "";

  return `

Current product context (user is viewing this product now):
- id: ${product.id}
- name: ${product.name}
- category: ${product.category}
- price: $${product.price.toFixed(2)}
- rating: ${product.rating} (${product.reviewCount} reviews)
- sizes: ${product.sizes.join(", ")}
- colors: ${product.colors.join(", ")}
- tags: ${product.tags.join(", ")}
- description: ${product.description}

Behavior rules when current product context exists:
- If user says "this", "it", "this one", default to this current product.
- Prioritize answering about this product before suggesting alternatives.
- If user asks to compare, provide at least 2 alternative products (different items) from the catalog with key tradeoffs and price differences versus the current product.
- For comparison requests, avoid recommending only the current product unless explicitly requested.
- When useful, call search_products and get_product_details tools to ground comparisons in real catalog data.`;
}

export function buildSystemPrompt({ currentProduct } = {}) {
  return `${SYSTEM_PROMPT}${formatCurrentProductContext(currentProduct)}`;
}

function getLatestUserText(messages = []) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message || message.role !== "user") continue;

    if (typeof message.content === "string") {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      const text = message.content
        .filter((part) => part?.type === "text" && typeof part.text === "string")
        .map((part) => part.text)
        .join(" ")
        .trim();
      if (text) return text;
    }
  }

  return "";
}

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
    execute: async ({ query, category }, options = {}) => {
      const latestUserText = getLatestUserText(options.messages || []);
      const userIntentCategory = inferCategoryFromText(latestUserText);
      const queryIntentCategory = inferCategoryFromText(query);
      const resolvedCategory = userIntentCategory || category || queryIntentCategory;
      const products = searchProducts({ q: query, category: resolvedCategory });

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
        appliedCategory: resolvedCategory || null,
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
