const UI_ONLY_LINE_PATTERNS = [
  /^\s*view\s+product\s*$/i,
  /^\s*view\s+details\s*$/i,
];

export function sanitizeAssistantDisplayText(text = "") {
  if (typeof text !== "string" || text.length === 0) {
    return "";
  }

  const sanitizedLines = text
    .split("\n")
    .filter((line) => !UI_ONLY_LINE_PATTERNS.some((pattern) => pattern.test(line)))
    .map((line) => line.replace(/\s+$/g, ""));

  return sanitizedLines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
