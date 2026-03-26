import { getProductById } from "@/lib/catalog";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json({ product });
}
