import { products } from "@/data/products";

export function searchProducts({ q, category } = {}) {
  let results = products;

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter((p) => {
      const searchText =
        `${p.name} ${p.description} ${p.tags.join(" ")} ${p.category}`.toLowerCase();
      return query.split(/\s+/).every((word) => searchText.includes(word));
    });
  }

  return results;
}

export function getProductById(id) {
  return products.find((p) => p.id === id);
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}
