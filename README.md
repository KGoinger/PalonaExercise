# Curator AI — AI Commerce Agent

AI-powered shopping assistant for an athletic apparel store. Handles product recommendations, visual search, and general Q&A through a single AI agent with tool-use capability.

**Live demo:** https://palona-exercise.vercel.app

---

## Features

| Feature | Description |
|---------|-------------|
| General Conversation | Ask the agent its name, capabilities, or general questions |
| Text-Based Recommendations | "Recommend a running outfit" — searches the catalog and explains why each product fits |
| Image-Based Search | Upload a photo to find visually similar products in the catalog |

All three are handled by a single AI agent using tool-use (function calling).

---

## Tech Stack & Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 (App Router) | Full-stack in one repo — React frontend + API routes as backend |
| AI | Vercel AI SDK | Unified AI SDK with built-in streaming, `useChat` hook, and tool calling. Provider swappable via env var (`AI_PROVIDER`/`AI_MODEL`) between Google Gemini and Anthropic Claude |
| Styling | Tailwind CSS 3.4 | Rapid UI development with Material Design 3 color tokens |
| Product Catalog | In-memory JSON | Sufficient for a predefined catalog (~15 items). No database overhead |
| Testing | Vitest | Fast, ESM-native test runner |

---

## Architecture

```
User → Next.js Frontend (useChat hook)
              │
              ▼  (streaming)
         POST /api/chat → Vercel AI SDK (streamText)
              │
        ┌─────┴─────┐
        ▼           ▼
  search_products  get_product_details
        │           │
        └─────┬─────┘
              ▼
        Product Catalog (JSON)

(AI_PROVIDER env var → Google/Anthropic)
```

The agent uses `streamText` with `stopWhen: stepCountIs(5)` to support multi-step tool use in a single user request (e.g., search then fetch details). The frontend renders tool results as product cards from assistant `message.parts`, including streamed tool output parts emitted by the Vercel AI SDK UI message protocol.

---

## Setup

### Prerequisites

- Node.js 18+
- An AI provider API key (Google Gemini or Anthropic Claude)

### Install & Run

```bash
npm install
```

Create a `.env.local` file in the project root:

```bash
# Google Gemini (default)
AI_PROVIDER=google
AI_MODEL=gemini-3-flash-preview
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key

# -- OR -- Anthropic Claude
# AI_PROVIDER=anthropic
# AI_MODEL=claude-3-5-haiku-20241022
# ANTHROPIC_API_KEY=your-anthropic-api-key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Switching Providers

Set `AI_PROVIDER` and `AI_MODEL` in `.env.local` and restart the dev server. Supported values for `AI_PROVIDER`: `google`, `anthropic`.

---

## API Documentation

### POST /api/chat

Chat endpoint using the Vercel AI SDK UI message stream protocol.

- **Request body:** `{ messages: UIMessage[], currentProductId?: string }`
- **Message format:** Vercel AI SDK UI message format. Supports text parts and image file parts. The frontend sends uploaded images as base64 file content, which the API normalizes before passing to the model.
- **Product-page context:** `currentProductId` is optional and is used by the embedded product-page assistant to ground comparisons against the currently viewed product.
- **Response:** Streaming UI message response (`toUIMessageStreamResponse()`).
- **Tools available to the agent:**

| Tool | Parameters | Description |
|------|-----------|-------------|
| `search_products` | `query: string`, `category?: "tops"\|"bottoms"\|"shoes"\|"accessories"` | Full-text search across the product catalog |
| `get_product_details` | `product_id: string` | Fetch full details for a specific product |

- **Frontend:** Tool results are rendered from assistant `message.parts` and displayed inline as product cards.

---

### GET /api/products

Browse and search the product catalog.

| Query Param | Type | Description |
|-------------|------|-------------|
| `q` | `string` | Full-text search (name, description, tags) |
| `category` | `string` | Filter by category: `tops`, `bottoms`, `shoes`, `accessories` |

**Response:**

```json
{
  "products": [ /* Product[] */ ],
  "categories": [ /* string[] */ ]
}
```

---

### GET /api/products/:id

Fetch a single product by ID.

**Response (200):**

```json
{ "product": { /* Product */ } }
```

**Response (404):**

```json
{ "error": "Product not found" }
```

---

## Project Structure

```
├── app/
│   ├── layout.js                    # Root layout with nav bars
│   ├── page.js                      # Landing / home page
│   ├── globals.css                  # Global styles & Tailwind base
│   ├── chat/
│   │   └── page.js                  # Chat UI — useChat hook, message rendering, image upload
│   ├── product/
│   │   ├── page.js                  # Product listing / browse page
│   │   └── [id]/page.js             # Dynamic product detail page
│   ├── case/
│   │   └── 001/page.js              # Demo case — pre-recorded conversation walkthrough
│   └── api/
│       ├── chat/route.js            # POST /api/chat — AI agent streaming endpoint
│       └── products/
│           ├── route.js             # GET /api/products — search & list
│           └── [id]/route.js        # GET /api/products/:id — single product
├── components/
│   ├── chat-view.js                 # Main chat UI — message state, form submission, image upload, default prompts
│   ├── chat-message.js              # Renders assistant/user messages + product card tool results
│   ├── product-card.js              # Product card UI (default and compact variants)
│   ├── image-upload-button.js       # Image upload button for visual search (base64 conversion)
│   ├── product-ask-curator.js       # Embedded chat widget on product detail pages
│   ├── markdown-content.js          # Markdown renderer (react-markdown + remark-gfm)
│   ├── site-disclaimer.js           # Footer disclaimer (hidden on /chat)
│   ├── top-nav-bar.js               # Top navigation bar
│   └── bottom-nav-bar.js            # Mobile bottom navigation bar
├── lib/
│   ├── agent.js                     # System prompt + agent tools (search_products, get_product_details)
│   ├── catalog.js                   # searchProducts(), getProductById(), inferCategoryFromText()
│   ├── model.js                     # getModel() — reads AI_PROVIDER/AI_MODEL env vars
│   ├── chat-products.js             # Extracts & deduplicates product cards from assistant message parts
│   ├── chat-display.js              # sanitizeAssistantDisplayText() — strips UI-only lines from output
│   └── chat-message-state.js        # Streaming state helpers (thinking detection, active message ID)
├── data/
│   ├── products.js                  # In-memory product catalog (~15 items)
│   └── cases/                       # Pre-recorded conversation data for demo case pages
├── tests/
│   ├── api/chat.test.js             # Chat route unit tests
│   ├── api/products.test.js         # API route unit tests
│   ├── lib/agent.test.js            # Agent tool unit tests
│   ├── lib/catalog.test.js          # Catalog search logic unit tests
│   ├── lib/chat-products.test.js    # Product card extraction unit tests
│   ├── lib/chat-display.test.js     # Message sanitization unit tests
│   └── lib/chat-message-state.test.js  # Streaming state detection unit tests
├── vitest.config.js                 # Vitest configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── package.json
```

---

## Run Tests

```bash
npm test
```
