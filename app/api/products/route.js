import { searchProducts, getCategories } from "@/lib/catalog";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;

  const products = searchProducts({ q, category });
  const categories = getCategories();

  return Response.json({ products, categories });
}
