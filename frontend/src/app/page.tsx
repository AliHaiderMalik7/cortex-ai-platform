"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

type Ticket = {
  id: number;
  title: string;
  priority: string;
  status: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type UploadedDoc = {
  filename: string;
  pages: number;
  chunks_stored: number;
};

const priorityDot: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const priorityBadge: Record<string, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20",
  medium:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
};

function IconSend() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M3.4 2.5a.75.75 0 0 0-.9.976l1.687 5.06a.75.75 0 0 0 .712.514h5.101a.75.75 0 0 1 0 1.5H4.899a.75.75 0 0 0-.712.514l-1.687 5.06a.75.75 0 0 0 .9.976 60 60 0 0 0 15.318-6.729.75.75 0 0 0 0-1.242A60 60 0 0 0 3.4 2.5Z" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.5l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8L12 2.5z" />
    </svg>
  );
}

function IconTicket() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5a1.5 1.5 0 0 0 0 3V16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.5a1.5 1.5 0 0 0 0-3V10Z"
      />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      />
    </svg>
  );
}

function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
        ),
        li: ({ children }) => <li>{children}</li>,
        code: ({ children }) => (
          <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">
            {children}
          </code>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto last:mb-0">
            <table className="min-w-full border-collapse text-left text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-current/20">{children}</thead>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-current/10 last:border-0">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-3 py-1.5 font-semibold">{children}</th>
        ),
        td: ({ children }) => <td className="px-3 py-1.5 align-top">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function IconFile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.5h7l4 4v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5v-13A1.5 1.5 0 0 1 7 3.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5V7a1 1 0 0 0 1 1h3.5" />
    </svg>
  );
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/tickets`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
        return res.json();
      })
      .then((data: Ticket[]) => setTickets(data))
      .catch((err) => setTicketsError(err.message))
      .finally(() => setLoadingTickets(false));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/documents`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
        return res.json();
      })
      .then((data: UploadedDoc[]) => setUploadedDocs(data))
      .catch((err) => setUploadError(err.message));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");
    setAsking(true);
    setAskError(null);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed with ${res.status}`);
      }

      const data: { answer: string; sources?: string[] } = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAsking(false);
    }
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/documents/upload`, {
        method: "POST",
        body: formData, // no Content-Type header — the browser sets the multipart boundary itself
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Upload failed with ${res.status}`);
      }

      const data: UploadedDoc = await res.json();
      setUploadedDocs((prev) => [data, ...prev]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  const highCount = tickets.filter((t) => t.priority === "high").length;
  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white font-sans dark:from-black dark:to-zinc-950">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-black/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
              <IconSparkle />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-50">
                Cortex
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                AI Operations Platform
              </p>
            </div>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            Learning build
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
        {/* Stats */}
        <section className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Total tickets
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {tickets.length}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              High priority
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-600 dark:text-rose-400">
              {highCount}
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Open
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {openCount}
            </p>
          </div>
        </section>

        {/* Tickets */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <IconTicket />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Tickets
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {loadingTickets && (
              <p className="px-5 py-6 text-sm text-zinc-500">Loading tickets…</p>
            )}

            {ticketsError && (
              <p className="px-5 py-6 text-sm text-rose-600 dark:text-rose-400">
                Couldn&apos;t load tickets: {ticketsError}. Is the backend
                running at {API_URL}?
              </p>
            )}

            {!loadingTickets && !ticketsError && tickets.length === 0 && (
              <p className="px-5 py-6 text-sm text-zinc-500">No tickets yet.</p>
            )}

            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      priorityDot[ticket.priority] ?? priorityDot.low
                    }`}
                  />
                  <span className="flex-1 text-sm text-zinc-800 dark:text-zinc-200">
                    {ticket.title}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {ticket.status}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      priorityBadge[ticket.priority] ?? priorityBadge.low
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upload documents */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <IconUpload />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Documents
            </h2>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Upload a PDF to add it to Cortex&apos;s knowledge base.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <IconUpload />
                {uploading ? "Uploading…" : "Upload PDF"}
              </button>
            </div>

            {uploadError && (
              <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">
                {uploadError}
              </p>
            )}

            {uploadedDocs.length > 0 && (
              <ul className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                {uploadedDocs.map((doc, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-2.5 text-sm dark:bg-zinc-800/60"
                  >
                    <IconFile />
                    <span className="flex-1 text-zinc-800 dark:text-zinc-200">
                      {doc.filename}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {doc.pages} {doc.pages === 1 ? "page" : "pages"} ·{" "}
                      {doc.chunks_stored} {doc.chunks_stored === 1 ? "chunk" : "chunks"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Ask assistant */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <IconSparkle />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Ask the assistant
            </h2>
          </div>

          <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex max-h-96 min-h-[8rem] flex-col gap-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 && !asking && (
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  Ask anything about your tickets, or how Cortex works.
                </p>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ChatMarkdown content={msg.content} />
                    ) : (
                      msg.content
                    )}

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-current/10 pt-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Sourced from:
                        </span>
                        {msg.sources.map((source, j) => (
                          <span
                            key={j}
                            className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-xs text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
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
                  <div className="flex items-center gap-1.5 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  </div>
                </div>
              )}

              {askError && (
                <p className="text-sm text-rose-600 dark:text-rose-400">
                  {askError}
                </p>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleAsk}
              className="flex items-center gap-2 border-t border-zinc-100 p-3 dark:border-zinc-800"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-xl border border-transparent bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-zinc-600"
              />
              <button
                type="submit"
                disabled={asking || !question.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <IconSend />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
