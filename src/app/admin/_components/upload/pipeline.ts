import { ALLOWED_MIME_TYPES, IngestEvent } from "./types";

export const isAllowedFile = (file: File) => {
  return ALLOWED_MIME_TYPES.has(file.type);
};

export const consumeIngestStream = async (
  response: Response,
  onEvent: (event: IngestEvent) => void,
) => {
  if (!response.body) {
    throw new Error("Ingest response has no body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    // { stream: true } keeps multi-byte chars intact when split across chunks.
    buffer += decoder.decode(value, { stream: true });

    // A chunk may end mid-line, so hold the last segment back until completed.
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }
      onEvent(JSON.parse(trimmed) as IngestEvent);
    }
  }

  // Flush a trailing line that arrived without a final newline.
  const tail = buffer.trim();
  if (tail.length > 0) {
    onEvent(JSON.parse(tail) as IngestEvent);
  }
};
