"use client";

import { AssistantSection } from "@/components/AssistantSection";
import { useAppState } from "@/context/AppStateContext";

export default function AssistantPage() {
  const { chatState } = useAppState();
  return (
    <AssistantSection
      messages={chatState.messages}
      asking={chatState.asking}
      askError={chatState.askError}
      question={chatState.question}
      setQuestion={chatState.setQuestion}
      onAsk={chatState.ask}
      chatEndRef={chatState.chatEndRef}
    />
  );
}
