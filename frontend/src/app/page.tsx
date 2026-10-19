"use client";

import { AssistantSection } from "@/components/AssistantSection";
import { DocumentsSection } from "@/components/DocumentsSection";
import { Header } from "@/components/Header";
import { OverviewSection } from "@/components/OverviewSection";
import { Sidebar } from "@/components/Sidebar";
import { TicketsSection } from "@/components/TicketsSection";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { useTickets } from "@/hooks/useTickets";

export default function Home() {
  const authState = useAuth();
  const ticketsState = useTickets(authState.token);
  const documentsState = useDocuments(authState.token);
  const chatState = useChat(authState.token);

  // Only the backend's actual enforced permission (POST /documents/upload
  // requires agent/admin - see app/dependencies.py) is reflected here. We
  // don't fake-restrict anything the backend doesn't really check.
  const canUploadDocuments = authState.user?.role === "agent" || authState.user?.role === "admin";

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-zinc-100 to-zinc-50 font-sans dark:from-zinc-950 dark:to-black">
      <Sidebar
        user={authState.user}
        authLoading={authState.authLoading}
        authError={authState.authError}
        onLogin={authState.login}
        onSignup={authState.signup}
        onLogout={authState.logout}
      />

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
            isLoggedIn={authState.user !== null}
          />

          <DocumentsSection
            uploadedDocs={documentsState.uploadedDocs}
            uploading={documentsState.uploading}
            uploadError={documentsState.uploadError}
            onUpload={documentsState.uploadFile}
            canUpload={canUploadDocuments}
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
