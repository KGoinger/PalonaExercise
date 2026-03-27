export function isAssistantMessageThinking(parts = [], textContent = "") {
  if (textContent.trim().length > 0) {
    return false;
  }

  return parts.some(
    (part) => part.type === "step-start" || String(part.type).startsWith("tool-")
  );
}
