// lib/storage.ts
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Save sessions to localStorage
export const saveSessions = (sessions: ChatSession[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save sessions to localStorage:', error);
    }
  }
};

// Load sessions from localStorage
export const loadSessions = (): ChatSession[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('chatSessions');
      if (stored) {
        const sessions = JSON.parse(stored);
        // Convert string dates back to Date objects
        return sessions.map((session: ChatSession) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error);
    }
  }
  return [];
};

// Clear all sessions from localStorage
export const clearSessions = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('chatSessions');
    } catch (error) {
      console.error('Failed to clear sessions from localStorage:', error);
    }
  }
};

// Get a specific session by ID
export const getSession = (sessionId: string): ChatSession | null => {
  const sessions = loadSessions();
  return sessions.find(session => session.id === sessionId) || null;
};

// Update a specific session
export const updateSession = (updatedSession: ChatSession): void => {
  const sessions = loadSessions();
  const updatedSessions = sessions.map(session => 
    session.id === updatedSession.id ? updatedSession : session
  );
  saveSessions(updatedSessions);
};