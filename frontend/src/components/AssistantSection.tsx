import { ChatMarkdown } from "./ChatMarkdown";
import { IconFile, IconSend, IconSparkle } from "./icons";
import type { ChatMessage } from "@/types";

type AssistantSectionProps = {
  messages: ChatMessage[];
  asking: boolean;
  askError: string | null;
  question: string;
  setQuestion: (value: string) => void;
  onAsk: (e: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
};

export function AssistantSection({
  messages,
  asking,
  askError,
  question,
  setQuestion,
  onAsk,
  chatEndRef,
}: AssistantSectionProps) {
  return (
    <section id="assistant" className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <IconSparkle />
        </span>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Ask the assistant</h2>
      </div>

      <div className="flex flex-col rounded-xl border border-zinc-100 bg-white shadow-md shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
        <div className="flex max-h-96 min-h-[9rem] flex-col gap-3.5 overflow-y-auto px-5 py-5">
          {messages.length === 0 && !asking && (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Ask anything about your tickets, or how Cortex works.
            </p>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "border border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                {msg.role === "assistant" ? <ChatMarkdown content={msg.content} /> : msg.content}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-current/10 pt-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">Sourced from:</span>
                    {msg.sources.map((source, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 rounded-md bg-black/5 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                      >
                        <IconFile />
                        {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {asking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
              </div>
            </div>
          )}

          {askError && <p className="text-sm text-rose-600 dark:text-rose-400">{askError}</p>}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onAsk} className="flex items-center gap-2.5 border-t border-zinc-100 p-4 dark:border-zinc-800">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-40"
          >
            <IconSend />
          </button>
        </form>
      </div>
    </section>
  );
}
