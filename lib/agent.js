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
- Do not output UI labels or button text such as "View Product" or "View Details". The interface will render product cards separately.
- Do not output raw product IDs, JSON blobs, or navigation instructions when recommending products.
- Keep responses conversational and concise — like a helpful store associate, not a product database.
- If no products match, say so honestly and suggest related categories.
- For image searches, describe what you see in the image first, then search for matching items.
- Never call search_products with an empty query and no category.
- For image searches, infer the product type first (e.g., tee/shoes/shorts), then call search_products with a specific query and category.
- When current product context exists and the user asks a generic question (for example: "fit and material differences"), prefer searching within the current product's category unless user explicitly asks another category.
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
- If user uploads an image while viewing a product, first compare the image item to this current product (type, material, color, and intended use), then recommend alternatives.
- If user asks to compare, provide at least 2 alternative products (different items) from the catalog with key tradeoffs and price differences versus the current product.
- For image-based recommendations on product pages, prioritize alternatives in the same category as the current product unless the user explicitly asks to explore other categories.
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

const CATEGORY_QUERY_HINTS = {
  tops: "top tee t-shirt tshirt shirt polo base layer",
  bottoms: "bottom shorts tights jogger pants leggings",
  shoes: "shoe shoes sneaker trainers running shoes trail shoes",
  accessories: "accessory cap hat belt vest socks",
};

export function buildAgentTools({ currentProduct } = {}) {
  return {
    search_products: tool({
      description:
        "Search the product catalog by text query and/or category. Do not call with an empty query unless category is explicitly provided.",
      parameters: z
        .object({
          query: z
            .string()
            .trim()
            .optional()
            .describe(
              "Search terms to match against product names, descriptions, and tags. Can be omitted when category is explicit."
            ),
          category: z
            .enum(["tops", "bottoms", "shoes", "accessories"])
            .optional()
            .describe("Optional category filter."),
        })
        .refine(
          (value) =>
            Boolean(
              value.category ||
                (typeof value.query === "string" && value.query.trim().length >= 2)
            ),
          {
            message:
              "Provide either a category, or a query with at least 2 characters.",
            path: ["query"],
          }
        ),
      execute: async ({ query, category }, options = {}) => {
        const normalizedQuery = typeof query === "string" ? query.trim() : "";
        const latestUserText = getLatestUserText(options.messages || []);
        const userIntentCategory = inferCategoryFromText(latestUserText);
        const queryIntentCategory = inferCategoryFromText(normalizedQuery);
        const lockToCurrentCategory = Boolean(currentProduct && !userIntentCategory);
        const resolvedCategory = lockToCurrentCategory
          ? currentProduct.category
          : userIntentCategory || category || queryIntentCategory || currentProduct?.category;

        const categoryHint =
          lockToCurrentCategory && currentProduct?.category
            ? CATEGORY_QUERY_HINTS[currentProduct.category] || currentProduct.category
            : "";
        const fallbackQueryFromCategory =
          resolvedCategory && !normalizedQuery
            ? CATEGORY_QUERY_HINTS[resolvedCategory] || resolvedCategory
            : "";
        const enrichedQuery = lockToCurrentCategory
          ? `${normalizedQuery} ${currentProduct.name} ${currentProduct.tags.join(
              " "
            )} ${categoryHint}`
          : normalizedQuery || fallbackQueryFromCategory;

        const products = searchProducts({
          q: enrichedQuery,
          category: resolvedCategory,
        });

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
          queryUsed: enrichedQuery,
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
}

export const agentTools = buildAgentTools();
