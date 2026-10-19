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

function AssistantAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
      <IconSparkle />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white dark:bg-zinc-200 dark:text-zinc-900">
      Y
    </div>
  );
}

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

      <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-md shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
        {/* Tinted canvas, distinct from the white card chrome around it */}
        <div className="scrollbar-thin flex max-h-[28rem] min-h-[11rem] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-zinc-50 to-zinc-100/70 px-5 py-5 dark:from-zinc-950/40 dark:to-black/20">
          {messages.length === 0 && !asking && (
            <div className="flex items-start gap-3">
              <AssistantAvatar />
              <p className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                Ask anything about your tickets, or how Cortex works.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "user" ? <UserAvatar /> : <AssistantAvatar />}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
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
            <div className="flex items-start gap-3">
              <AssistantAvatar />
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
              </div>
            </div>
          )}

          {askError && <p className="text-sm text-rose-600 dark:text-rose-400">{askError}</p>}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onAsk} className="flex items-center gap-2.5 border-t border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
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
