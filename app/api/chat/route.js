import { convertToModelMessages, streamText } from "ai";
import { getModel } from "@/lib/model";
import { buildSystemPrompt, buildAgentTools } from "@/lib/agent";
import { getProductById } from "@/lib/catalog";

function sanitizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => message && typeof message === "object")
    .map((message) => {
      if (!Array.isArray(message.parts)) {
        return message;
      }

      return {
        ...message,
        parts: message.parts
          .filter((part) => part && typeof part === "object")
          .map((part) => {
            if (part.type !== "file") return part;
            if (typeof part.url !== "string" || part.url.length === 0) return null;

            const base64Marker = ";base64,";
            if (part.url.startsWith("data:") && part.url.includes(base64Marker)) {
              const mediaTypeFromUrl = part.url.slice(5, part.url.indexOf(base64Marker));
              return {
                ...part,
                mediaType:
                  typeof part.mediaType === "string" && part.mediaType.length > 0
                    ? part.mediaType
                    : mediaTypeFromUrl,
                url: part.url.slice(part.url.indexOf(base64Marker) + base64Marker.length),
              };
            }

            return part;
          })
          .filter(
            (part) =>
              part &&
              (part.type !== "file" ||
                (typeof part.url === "string" &&
                  part.url.length > 0 &&
                  typeof part.mediaType === "string" &&
                  part.mediaType.length > 0))
          ),
      };
    });
}

export async function POST(request) {
  const { messages = [], currentProductId } = await request.json();
  const sanitizedMessages = sanitizeMessages(messages);
  const currentProduct = currentProductId ? getProductById(currentProductId) : undefined;

  const result = streamText({
    model: getModel(),
    system: buildSystemPrompt({ currentProduct }),
    messages: await convertToModelMessages(sanitizedMessages),
    tools: buildAgentTools({ currentProduct }),
    maxSteps: 5,
  });

  return result.toUIMessageStreamResponse();
}
