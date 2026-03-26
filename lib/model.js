import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

const providers = {
  google: (modelId) => google(modelId),
  anthropic: (modelId) => anthropic(modelId),
};

export function getModel() {
  const providerName = process.env.AI_PROVIDER || "google";
  const modelId = process.env.AI_MODEL || "gemini-2.0-flash";
  const factory = providers[providerName];
  if (!factory) {
    throw new Error(
      `Unknown AI_PROVIDER "${providerName}". Supported: ${Object.keys(providers).join(", ")}`
    );
  }
  return factory(modelId);
}
