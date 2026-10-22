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
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
      <IconSparkle />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-zinc-200">
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
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
          <IconSparkle />
        </span>
        <h2 className="text-sm font-semibold text-zinc-100">Ask the assistant</h2>
      </div>

      <div className="flex flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-800 shadow-lg shadow-black/20">
        {/* Tinted canvas, distinct from the card chrome around it */}
        <div className="scrollbar-thin flex max-h-[28rem] min-h-[11rem] flex-col gap-4 overflow-y-auto bg-zinc-900/40 px-5 py-5">
          {messages.length === 0 && !asking && (
            <div className="animate-fade-in-up flex items-start gap-3">
              <AssistantAvatar />
              <p className="rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-400">
                Ask anything about your tickets, or how Cortex works.
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            // The streaming assistant bubble starts empty and fills in as
            // chunks arrive (see useChat's appendToLastMessage) - while it's
            // still empty, show the typing dots INSIDE this same bubble
            // instead of a separate indicator underneath it.
            const isStreamingPlaceholder =
              asking && i === messages.length - 1 && msg.role === "assistant" && msg.content === "";

            return (
              <div
                key={i}
                className={`animate-fade-in-up flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "user" ? <UserAvatar /> : <AssistantAvatar />}
                <div
                  className={`max-w-[75%] rounded-md px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white"
                      : "border border-zinc-700 bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {isStreamingPlaceholder ? (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
                    </div>
                  ) : msg.role === "assistant" ? (
                    <ChatMarkdown content={msg.content} />
                  ) : (
                    msg.content
                  )}

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-current/10 pt-2">
                      <span className="text-xs text-zinc-400">Sourced from:</span>
                      {msg.sources.map((source, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 rounded-md bg-white/10 px-1.5 py-0.5 text-xs text-zinc-300"
                        >
                          <IconFile />
                          {source}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {askError && <p className="text-sm text-rose-400">{askError}</p>}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onAsk} className="flex items-center gap-2.5 border-t border-zinc-700 bg-zinc-800 p-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question…"
            className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-50 outline-none transition-shadow placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
          <button
            type="submit"
            disabled={asking || !question.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white transition-all hover:bg-violet-500 hover:shadow-md active:scale-[0.93] disabled:opacity-40 disabled:active:scale-100"
          >
            <IconSend />
          </button>
        </form>
      </div>
    </section>
  );
}
