import { streamText } from "ai";
import { getModel } from "@/lib/model";
import { SYSTEM_PROMPT, agentTools } from "@/lib/agent";

export async function POST(request) {
  const { messages } = await request.json();

  const result = streamText({
    model: getModel(),
    system: SYSTEM_PROMPT,
    messages,
    tools: agentTools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
