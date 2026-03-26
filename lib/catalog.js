import { products } from "@/data/products";

const STOP_WORDS = new Set([
  "i",
  "me",
  "my",
  "need",
  "want",
  "looking",
  "for",
  "a",
  "an",
  "the",
  "some",
  "please",
  "with",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "under",
  "over",
  "is",
  "are",
  "show",
  "find",
  "recommend",
]);

const CATEGORY_KEYWORDS = {
  shoes: [
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "trainer",
    "trainers",
    "running shoe",
    "trail shoe",
    "footwear",
    "boot",
    "boots",
    "flat",
  ],
  tops: [
    "top",
    "tops",
    "shirt",
    "shirts",
    "tee",
    "t-shirt",
    "tshirt",
    "polo",
    "base layer",
    "jacket",
    "hoodie",
  ],
  bottoms: [
    "bottom",
    "bottoms",
    "short",
    "shorts",
    "pant",
    "pants",
    "jogger",
    "joggers",
    "tight",
    "tights",
    "legging",
    "leggings",
  ],
  accessories: [
    "accessory",
    "accessories",
    "cap",
    "hat",
    "belt",
    "vest",
    "sock",
    "socks",
    "glove",
    "gloves",
  ],
};

function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

function tokenize(text = "") {
  return normalizeText(text)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

export function inferCategoryFromText(text = "") {
  const normalized = normalizeText(text);
  if (!normalized) return undefined;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }

  return undefined;
}

function scoreProduct(product, queryText, queryTokens) {
  if (!queryText) return 1;

  const name = normalizeText(product.name);
  const description = normalizeText(product.description);
  const tags = normalizeText(product.tags.join(" "));
  const category = normalizeText(product.category);

  let score = 0;

  for (const token of queryTokens) {
    if (category.includes(token)) score += 12;
    if (name.includes(token)) score += 7;
    if (tags.includes(token)) score += 9;
    if (description.includes(token)) score += 3;
  }

  if (name.includes(queryText)) score += 10;
  if (tags.includes(queryText)) score += 8;
  if (category.includes(queryText)) score += 10;

  return score;
}

export function searchProducts({ q, category } = {}) {
  const normalizedQuery = normalizeText(q);
  const inferredCategory = !category ? inferCategoryFromText(normalizedQuery) : undefined;
  const resolvedCategory = category || inferredCategory;
  const queryTokens = tokenize(normalizedQuery);
  let results = products.map((product) => ({ product, score: 0 }));

  if (resolvedCategory) {
    results = results.filter(({ product }) => product.category === resolvedCategory);
  }

  if (normalizedQuery) {
    results = results
      .map(({ product }) => ({
        product,
        score: scoreProduct(product, normalizedQuery, queryTokens),
      }))
      .filter(({ score }) => score > 0);
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
      return b.product.reviewCount - a.product.reviewCount;
    })
    .map(({ product }) => product);
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}
