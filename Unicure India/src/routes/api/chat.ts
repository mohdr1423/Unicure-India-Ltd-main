import { createFileRoute } from "@tanstack/react-router";
import { BELLA_SYSTEM_PROMPT } from "@/lib/bella-knowledge";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return false;
  return true;
}

// Stale cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000);

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("cf-connecting-ip") ||
          "unknown";

        if (!checkRateLimit(ip)) {
          return new Response(
            "You are sending messages too quickly. Please wait a moment and try again.",
            { status: 429 },
          );
        }

        let body: { messages?: ChatMessage[] };
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid request.", { status: 400 });
        }

        const messages = Array.isArray(body?.messages) ? body.messages : [];
        const clean: ChatMessage[] = messages
          .filter(
            (m) =>
              m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
          )
          .slice(-20)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

        if (clean.length === 0) {
          return new Response("Please enter a message.", { status: 400 });
        }

        // Support standard keys
        const key =
          process.env.AI_API_KEY ||
          process.env.OPENAI_API_KEY ||
          process.env.GROQ_API_KEY ||
          process.env.GEMINI_API_KEY;

        if (!key) {
          // Tell client to use local fallback knowledge engine seamlessly
          return new Response("USE_LOCAL_FALLBACK", { status: 503 });
        }

        try {
          const endpoint =
            process.env.AI_API_ENDPOINT || "https://api.openai.com/v1/chat/completions";
          const model = process.env.AI_MODEL || "gpt-4o-mini";

          const upstream = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model,
              stream: true,
              messages: [{ role: "system", content: BELLA_SYSTEM_PROMPT }, ...clean],
            }),
          });

          if (!upstream.ok || !upstream.body) {
            if (upstream.status === 429) {
              return new Response(
                "Bella is receiving high traffic right now. Please try again in a few moments.",
                { status: 429 },
              );
            }
            return new Response("USE_LOCAL_FALLBACK", { status: 502 });
          }

          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          const reader = upstream.body.getReader();
          let buffer = "";

          const stream = new ReadableStream<Uint8Array>({
            async pull(controller) {
              try {
                const { value, done } = await reader.read();
                if (done) {
                  controller.close();
                  return;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const raw of lines) {
                  const line = raw.trim();
                  if (!line.startsWith("data:")) continue;
                  const payload = line.slice(5).trim();
                  if (!payload || payload === "[DONE]") continue;
                  try {
                    const json = JSON.parse(payload);
                    const delta = json?.choices?.[0]?.delta?.content;
                    if (typeof delta === "string" && delta.length > 0) {
                      controller.enqueue(encoder.encode(delta));
                    }
                  } catch {
                    // Ignore malformed line
                  }
                }
              } catch {
                controller.close();
              }
            },
            cancel() {
              reader.cancel().catch(() => {});
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
            },
          });
        } catch (err) {
          console.error("Chat API error:", err);
          return new Response("USE_LOCAL_FALLBACK", { status: 502 });
        }
      },
    },
  },
});
