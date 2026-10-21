export type Ticket = {
  id: number;
  title: string;
  priority: string;
  topic: string;
  status: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export type UploadedDoc = {
  filename: string;
  pages: number;
  chunks_stored: number;
};

export type AuthUser = {
  id: number;
  email: string;
  role: "user" | "agent" | "admin";
};
