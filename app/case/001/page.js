import Link from "next/link";
import TopNavBar from "../../../components/top-nav-bar";
import BottomNavBar from "../../../components/bottom-nav-bar";
import ChatMessage from "../../../components/chat-message";
import { case001 } from "../../../data/cases/case-001";
import { products } from "../../../data/products";

function hydrateCaseMessages(messages) {
  const productMap = new Map(products.map((product) => [product.id, product]));

  return messages.map((message) => ({
    ...message,
    parts: (message.parts || []).map((part) => {
      if (
        part.type !== "tool-search_products" ||
        part.state !== "output-available" ||
        !Array.isArray(part.output?.productIds)
      ) {
        return part;
      }

      const hydratedProducts = part.output.productIds
        .map((productId) => productMap.get(productId))
        .filter(Boolean);

      return {
        ...part,
        output: {
          ...part.output,
          products: hydratedProducts,
        },
      };
    }),
  }));
}

export default function CaseReplayPage() {
  const replayMessages = hydrateCaseMessages(case001.messages);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopNavBar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-28 pt-24">
        <section className="mb-8 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Interview Case Replay
          </p>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            {case001.title}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">{case001.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/chat"
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary transition-colors hover:bg-primary-container"
            >
              Open Live Agent
            </Link>
            <Link
              href="/product"
              className="rounded-lg border border-outline-variant/30 px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Browse Catalog
            </Link>
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-10 pb-4">
          {replayMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
