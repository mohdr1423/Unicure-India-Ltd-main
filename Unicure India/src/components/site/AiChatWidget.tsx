import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  User,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLocalBellaResponse } from "@/lib/bella-knowledge";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! I'm Bella, the Unicure India Assistant. How can I help you today?",
  timestamp: "Just now",
};

const QUICK_PROMPTS = [
  "What does Unicure India do?",
  "Our manufacturing capabilities",
  "Our international presence",
  "Who is the leadership team?",
  "Tell me about quality assurance",
  "Tell me about co-manufacturing",
];

const MAX_INPUT_LENGTH = 2000;

export function AiChatWidget() {
  // Collapsed by default on page load
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [busy, setBusy] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      setHasInteracted(true);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Reset conversation
  function handleReset() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setMessages([INITIAL_GREETING]);
    setInput("");
    setBusy(false);
  }

  // Handle sending a user question
  async function sendMessage(overrideText?: string) {
    const text = (overrideText || input).trim();
    if (!text || busy) return;

    setInput("");
    const userMsgId = `user_${Date.now()}`;
    const assistantMsgId = `asst_${Date.now()}`;

    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, role: "user", content: text },
    ];

    setMessages([...newMessages, { id: assistantMsgId, role: "assistant", content: "" }]);
    setBusy(true);

    const localMatch = getLocalBellaResponse(text);

    // Try server-side AI stream first
    const controller = new AbortController();
    abortRef.current = controller;

    let streamedContent = "";
    let serverSucceeded = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk.includes("USE_LOCAL_FALLBACK")) {
            break;
          }
          streamedContent += chunk;
          serverSucceeded = true;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: streamedContent } : msg,
            ),
          );
        }
      }
    } catch {
      // Stream failed or aborted
    } finally {
      abortRef.current = null;
    }

    // If server AI was unavailable or had no key, seamlessly apply local knowledge response
    if (!serverSucceeded || !streamedContent.trim()) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  localMatch.reply ||
                  "I'm sorry, I'm temporarily unable to answer that. Please try again in a moment.",
              }
            : msg,
        ),
      );
    }

    setBusy(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating Chat Trigger Button — Positioned above mobile CTA bar on small screens */}
      <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none max-w-[calc(100vw-1.5rem)]">
        {!open && !hasInteracted && (
          <div className="hidden xs:flex animate-bounce rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg border border-border items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ask Bella</span>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close Bella AI Assistant" : "Open Bella AI Assistant"}
          className={cn(
            "group relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95",
            open
              ? "bg-slate-900 text-white rotate-90 scale-95"
              : "bg-[color:var(--brand-blue-dark)] text-white hover:scale-105 hover:shadow-glow ring-2 ring-[#C8102E]/80",
          )}
        >
          {open ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform" />
          ) : (
            <>
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C8102E] text-[9px] font-bold text-white items-center justify-center">
                  AI
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Container — Fixed anchor, safe area top clearance, never overlaps header */}
      {open && (
        <div
          className={cn(
            "fixed z-50 overflow-hidden bg-white shadow-2xl border border-border/80 flex flex-col",
            // Mobile: Anchored at bottom-20 (above CTA bar), with top clearance below header
            "inset-x-2 sm:inset-x-auto bottom-20 top-auto h-[480px] max-h-[calc(100dvh-7.5rem)] rounded-2xl sm:rounded-3xl max-w-[calc(100vw-1rem)] sm:max-w-[440px]",
            // Desktop: Bottom-right floating card
            "sm:right-6 sm:bottom-24 sm:w-[410px] sm:h-[580px] sm:max-h-[calc(100vh-8rem)]",
            "animate-in slide-in-from-bottom-5 duration-300",
          )}
        >
          {/* Header */}
          <div className="bg-[color:var(--brand-blue-dark)] text-white px-4 py-3.5 sm:p-5 flex items-center justify-between border-b-2 border-[#C8102E] shrink-0">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="relative grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-2xl bg-gradient-to-tr from-[#C8102E] to-red-500 text-white shadow-md shrink-0">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[color:var(--brand-blue-dark)] bg-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm sm:text-base tracking-tight leading-none truncate">
                    Bella
                  </h3>
                  <span className="rounded bg-[#C8102E] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white shrink-0">
                    AI
                  </span>
                </div>
                <div className="text-[11px] text-white/80 mt-0.5 truncate">
                  Unicure India Assistant
                </div>
                <div className="text-[10px] text-emerald-300 font-medium mt-0.5 flex items-center gap-1 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">Ask me anything about Unicure India</span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons — Generous touch targets */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleReset}
                aria-label="Restart conversation"
                title="Restart conversation"
                className="grid h-9 w-9 place-items-center rounded-full text-white/75 hover:bg-white/10 active:bg-white/20 hover:text-white transition cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close Bella AI Assistant"
                title="Close chat"
                className="grid h-9 w-9 place-items-center rounded-full text-white/75 hover:bg-white/10 active:bg-white/20 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-gradient-to-b from-slate-50/50 to-white text-sm"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2.5 text-sm",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {msg.role === "assistant" && (
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[color:var(--brand-blue-dark)] text-white shadow-xs mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-3 sm:p-3.5 leading-relaxed break-words shadow-xs text-xs sm:text-sm",
                    msg.role === "user"
                      ? "bg-[color:var(--brand-blue-dark)] text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none",
                  )}
                >
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-slate-900 prose-a:text-[#0f2b48] prose-a:font-semibold prose-a:underline">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-700 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex gap-2.5 items-center text-muted-foreground text-xs pl-9">
                <span className="flex items-center gap-1.5 bg-white border border-border px-3 py-1.5 rounded-full shadow-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Bella is thinking...</span>
                </span>
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/90 overflow-x-auto flex gap-2 no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                disabled={busy}
                onClick={() => sendMessage(q)}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-700 hover:border-primary hover:text-primary active:bg-slate-100 transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 sm:p-3.5 bg-white border-t border-border flex items-end gap-2 shrink-0">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={MAX_INPUT_LENGTH}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about Unicure India..."
              className="flex-1 max-h-24 resize-none rounded-xl border border-border bg-slate-50 px-3.5 py-2 text-xs sm:text-sm focus:border-primary focus:bg-white focus:outline-none transition leading-normal"
            />
            <Button
              size="icon"
              disabled={!input.trim() || busy}
              onClick={() => sendMessage()}
              className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl bg-[color:var(--brand-blue-dark)] text-white hover:bg-[color:var(--brand-blue-dark)]/90 shadow-sm cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}