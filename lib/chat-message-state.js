export function isAssistantMessageThinking(parts = [], textContent = "") {
  if (textContent.trim().length > 0) {
    return false;
  }

  return parts.some(
    (part) => part.type === "step-start" || String(part.type).startsWith("tool-")
  );
}

export function getStreamingAssistantId(messages = [], status = "") {
  if (status !== "streaming" || !Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  const latestMessage = messages[messages.length - 1];
  return latestMessage.role === "assistant" ? latestMessage.id : null;
}
