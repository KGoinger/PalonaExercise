import { beforeEach, describe, expect, it, vi } from "vitest";

const mockConvertToModelMessages = vi.fn(async (messages) => messages);
const mockStreamText = vi.fn();
const mockStepCountIs = vi.fn((count) => ({ type: "step-count", count }));
const mockGetModel = vi.fn(() => "mock-model");
const mockBuildSystemPrompt = vi.fn(() => "mock-system-prompt");
const mockBuildAgentTools = vi.fn(() => ({ search_products: {} }));
const mockGetProductById = vi.fn(() => undefined);

vi.mock("ai", () => ({
  convertToModelMessages: mockConvertToModelMessages,
  streamText: mockStreamText,
  stepCountIs: mockStepCountIs,
}));

vi.mock("@/lib/model", () => ({
  getModel: mockGetModel,
}));

vi.mock("@/lib/agent", () => ({
  buildSystemPrompt: mockBuildSystemPrompt,
  buildAgentTools: mockBuildAgentTools,
}));

vi.mock("@/lib/catalog", () => ({
  getProductById: mockGetProductById,
}));

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStreamText.mockReturnValue({
      toUIMessageStreamResponse: vi.fn(() => new Response("ok")),
    });
  });

  it("configures a multi-step loop that can continue after tool calls", async () => {
    const { POST } = await import("@/app/api/chat/route");

    const response = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              id: "user-1",
              role: "user",
              parts: [{ type: "text", text: "Recommend me a t-shirt for sports." }],
            },
          ],
        }),
      })
    );

    expect(response).toBeInstanceOf(Response);
    expect(mockStepCountIs).toHaveBeenCalledWith(5);
    expect(mockStreamText).toHaveBeenCalledWith(
      expect.objectContaining({
        stopWhen: { type: "step-count", count: 5 },
      })
    );
    expect(mockStreamText).not.toHaveBeenCalledWith(
      expect.objectContaining({
        maxSteps: expect.anything(),
      })
    );
  });
});
