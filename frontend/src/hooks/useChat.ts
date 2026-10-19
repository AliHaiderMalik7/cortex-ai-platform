"use client";

import { useEffect, useRef, useState } from "react";

import { API_URL, authHeaders } from "@/lib/api";
import type { ChatMessage } from "@/types";

export function useChat(token: string | null) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [asking, setAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  // null until the first message gets a conversation_id back from the backend;
  // every message after that sends it so the backend knows which history to use.
  const [conversationId, setConversationId] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, asking]);

  async function ask(e: React.FormEvent) {
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
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ question: trimmed, conversation_id: conversationId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed with ${res.status}`);
      }

      const data: { answer: string; sources?: string[]; conversation_id: number } = await res.json();
      setConversationId(data.conversation_id);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer, sources: data.sources }]);
    } catch (err) {
      setAskError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAsking(false);
    }
  }

  return { question, setQuestion, messages, asking, askError, ask, chatEndRef };
}
