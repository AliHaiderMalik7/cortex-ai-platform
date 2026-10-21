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

  // Appends text to the LAST message in the array - used as each streamed
  // chunk arrives, so the bubble grows in place instead of waiting for
  // one complete response.
  function appendToLastMessage(text: string) {
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      next[next.length - 1] = { ...last, content: last.content + text };
      return next;
    });
  }

  function setSourcesOnLastMessage(sources: string[]) {
    setMessages((prev) => {
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], sources };
      return next;
    });
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    // Placeholder assistant message, empty at first - streamed text fills
    // it in via appendToLastMessage as chunks arrive.
    setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
    setQuestion("");
    setAsking(true);
    setAskError(null);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ question: trimmed, conversation_id: conversationId }),
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Request failed with ${res.status}`);
      }

      // Server-Sent Events arrive as raw text over time, not one JSON blob -
      // read the stream manually and parse "data: <json>\n\n" blocks as they
      // complete. A chunk from the network can cut a block in half, so we
      // buffer and only process whole blocks (keeping any trailing partial
      // one for the next read).
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? ""; // last entry may be an incomplete block - keep it

        for (const block of blocks) {
          const line = block.trim();
          if (!line.startsWith("data: ")) continue;
          const event = JSON.parse(line.slice("data: ".length));

          if (event.type === "text") {
            appendToLastMessage(event.text);
          } else if (event.type === "done") {
            setConversationId(event.conversation_id);
            setSourcesOnLastMessage(event.sources ?? []);
          } else if (event.type === "error") {
            throw new Error(event.detail ?? "Something went wrong");
          }
        }
      }
    } catch (err) {
      setAskError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAsking(false);
    }
  }

  return { question, setQuestion, messages, asking, askError, ask, chatEndRef };
}
