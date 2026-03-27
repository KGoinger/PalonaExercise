function dedupeProductsById(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product?.id) return true;
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
}

function normalizeMatchText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMentionedProducts(products, textContent = "") {
  const normalizedText = normalizeMatchText(textContent);
  if (!normalizedText) return [];

  return products
    .map((product) => {
      const normalizedName = normalizeMatchText(product?.name || "");
      if (!normalizedName) return null;
      const mentionIndex = normalizedText.indexOf(normalizedName);
      if (mentionIndex === -1) return null;
      return { product, mentionIndex };
    })
    .filter(Boolean)
    .sort((a, b) => a.mentionIndex - b.mentionIndex)
    .map(({ product }) => product);
}

export function extractProductCardsFromParts(parts = [], textContent = "") {
  const toolParts = parts.filter(
    (part) =>
      part.type === "tool-search_products" &&
      part.state === "output-available" &&
      Array.isArray(part.output?.products)
  );

  if (!toolParts.length) return [];

  const partsWithProducts = toolParts.filter(
    (part) => (part.output?.products || []).length > 0
  );

  if (!partsWithProducts.length) return [];

  const allProducts = dedupeProductsById(
    partsWithProducts.flatMap((part) => part.output?.products || [])
  );
  const mentionedProducts = dedupeProductsById(
    getMentionedProducts(allProducts, textContent)
  );

  if (mentionedProducts.length > 0) {
    return mentionedProducts;
  }

  const withCategory = partsWithProducts.filter(
    (part) =>
      typeof part.output?.appliedCategory === "string" &&
      part.output.appliedCategory.length > 0
  );

  const candidatePool = withCategory.length > 0 ? withCategory : partsWithProducts;

  const preferredPart = candidatePool.reduce((best, current) => {
    const bestLen = (best.output?.products || []).length;
    const currentLen = (current.output?.products || []).length;
    return currentLen < bestLen ? current : best;
  }, candidatePool[0]);

  const preferredProducts = dedupeProductsById(preferredPart.output?.products || []);
  const hasCategory =
    typeof preferredPart.output?.appliedCategory === "string" &&
    preferredPart.output.appliedCategory.length > 0;

  if (!hasCategory && preferredProducts.length >= 10) {
    return [];
  }

  return preferredProducts;
}
