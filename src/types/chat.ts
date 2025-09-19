export interface BackendMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  createdAt: Date;
  sessionId: string;
}

export interface NewMessageData {
  chatId: string;
  user: BackendMessage;
  ai: BackendMessage;
}