"use client";

import { AssistantSection } from "@/components/AssistantSection";
import { DocumentsSection } from "@/components/DocumentsSection";
import { Header } from "@/components/Header";
import { OverviewSection } from "@/components/OverviewSection";
import { Sidebar } from "@/components/Sidebar";
import { TicketsSection } from "@/components/TicketsSection";
import { useChat } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { useTickets } from "@/hooks/useTickets";

export default function Home() {
  const ticketsState = useTickets();
  const documentsState = useDocuments();
  const chatState = useChat();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 font-sans dark:from-zinc-950 dark:to-black">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 md:px-10 md:py-12">
          <OverviewSection tickets={ticketsState.tickets} />

          <TicketsSection
            tickets={ticketsState.tickets}
            loadingTickets={ticketsState.loadingTickets}
            ticketsError={ticketsState.ticketsError}
            newTicketTitle={ticketsState.newTicketTitle}
            setNewTicketTitle={ticketsState.setNewTicketTitle}
            creatingTicket={ticketsState.creatingTicket}
            createTicketError={ticketsState.createTicketError}
            onCreateTicket={ticketsState.createTicket}
          />

          <DocumentsSection
            uploadedDocs={documentsState.uploadedDocs}
            uploading={documentsState.uploading}
            uploadError={documentsState.uploadError}
            onUpload={documentsState.uploadFile}
          />

          <AssistantSection
            messages={chatState.messages}
            asking={chatState.asking}
            askError={chatState.askError}
            question={chatState.question}
            setQuestion={chatState.setQuestion}
            onAsk={chatState.ask}
            chatEndRef={chatState.chatEndRef}
          />
        </main>
      </div>
    </div>
  );
}
