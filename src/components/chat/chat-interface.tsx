"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ThemeToggle } from "../theme/theme-toggle"
import { Button } from "../ui/button"
import { Menu, Bot } from "lucide-react"
// import { trpc } from "@/utils/trpc"
import { trpc } from "../../utils/trpc"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Fetch user's chats from backend
  const { data: backendChats = [], refetch: refetchChats } = trpc.chat.getChats.useQuery()

  // Fetch messages for current chat
  const { data: newMessages } = trpc.chat.getMessages.useQuery(
    {
      chatId: currentSession?.id || '',
      // lastMessageId: currentSession?.messages[currentSession.messages.length - 1]?.id
      skip: 0,
      take: 50
    },
    {
      enabled: !!currentSession?.id,
      refetchInterval: 2000, // Poll every 2 seconds
    }
  );

  // Subscribe to new messages for the current chat
  trpc.chat.newMessages.useSubscription(
    { chatId: currentSession?.id || '' },
    {
      enabled: !!currentSession?.id,
      onData: (data: {
        chatId: string;
        user;
        ai;
      }) => {
        // Update the current session with new messages
        if (currentSession && data.chatId === currentSession.id) {
          const newMessages = [data.user, data.ai].filter(msg =>
            !currentSession.messages.some(m => m.id === msg.id)
          );

          if (newMessages.length > 0) {
            const mappedMessages = newMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              role: msg.sender as "user" | "assistant",
              timestamp: new Date(msg.createdAt)
            }));

            const updatedSession = {
              ...currentSession,
              messages: [...currentSession.messages, ...mappedMessages],
              updatedAt: new Date()
            };

            setCurrentSession(updatedSession);
            setSessions(prev => prev.map(s =>
              s.id === updatedSession.id ? updatedSession : s
            ));
          }
        }
      }
    }
  )

  // Map backend chats to frontend sessions
  useEffect(() => {
    if (backendChats.length > 0) {
      const mappedSessions = backendChats.map(chat => ({
        id: chat.id,
        title: chat.title,
        messages: chat.messages ? chat.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.sender as "user" | "assistant",
          timestamp: new Date(msg.createdAt)
        })) : [],
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt)
      }));

      setSessions(mappedSessions);
      if (!currentSession && mappedSessions.length > 0) {
        setCurrentSession(mappedSessions[0]);
      }
    }
  }, [backendChats]);

  useEffect(() => {
    if (newMessages && newMessages.length > 0 && currentSession) {
      const mappedMessages = newMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.sender as "user" | "assistant",
        timestamp: new Date(msg.createdAt)
      }));

      // Filter out messages we already have
      const uniqueMessages = mappedMessages.filter(newMsg =>
        !currentSession.messages.some(existingMsg => existingMsg.id === newMsg.id)
      );

      if (uniqueMessages.length > 0) {
        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, ...uniqueMessages],
          updatedAt: new Date()
        };

        setCurrentSession(updatedSession);
        setSessions(prev => prev.map(s =>
          s.id === updatedSession.id ? updatedSession : s
        ));
      }
    }
  }, [newMessages, currentSession]);


  // Mutation to start a new chat
  const startChat = trpc.chat.startChat.useMutation({
    onSuccess: (chat) => {
      refetchChats();
    },
  });

  // Mutation to send message
  const sendMessage = trpc.chat.sendMessage.useMutation({
    onMutate: () => setIsTyping(true),
    onSuccess: () => {
      setIsTyping(false);
      // refetchChats(); // Refresh to get updated messages
    },
    onError: () => setIsTyping(false),
  });

  // Mutation to delete chat
  const deleteChat = trpc.chat.deleteChat.useMutation({
    onSuccess: () => {
      refetchChats();
    },
  });

  const createNewSession = () => {
    startChat.mutate({ title: "New Career Chat" });
  }

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session)
    setSidebarOpen(false)
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteChat.mutate({ chatId: sessionId });
    if (currentSession?.id === sessionId) {
      setCurrentSession(sessions.length > 1 ? sessions.find(s => s.id !== sessionId) || null : null);
    }
  }

  const addMessage = (content: string, role: "user" | "assistant") => {
    if (!currentSession) {
      // If no session exists, create a new one first
      startChat.mutate({
        title: content.slice(0, 50) + (content.length > 50 ? "..." : "")
      });
      return;
    }

    if (role === "user") {
      // Send user message to backend
      sendMessage.mutate({
        chatId: currentSession.id,
        content,
        role: "user"
      });

      // Optimistically add user message to UI
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        role: "user",
        timestamp: new Date()
      };

      const updatedSession = {
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
        updatedAt: new Date()
      };

      setCurrentSession(updatedSession);
      setSessions(prev => prev.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      ));
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <ChatSidebar
          sessions={sessions}
          currentSession={currentSession}
          onSelectSession={selectSession}
          onNewSession={createNewSession}
          onDeleteSession={handleDeleteSession}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Career Counselor AI</h1>
                <p className="text-sm text-muted-foreground">Your AI-powered career guidance assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden">
          <ChatMessages
            messages={currentSession?.messages || []}
            // onAddMessage={addMessage}
            isTyping={isTyping}
          />
        </div>

        {/* Chat input */}
        {/* <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <ChatInput
            chatId={currentSession.id || ''}
            onMessageSent={() => refetchChats()} // Refresh chats after sending
            // onMessageSent={(content) => addMessage(content, "user")}
            disabled={isTyping}
          />
        </div> */}

        {currentSession ? (
          <div className="border-t bg-card/50 backdrop-blur-sm p-4">
            <ChatInput
              chatId={currentSession.id}
              onMessageSent={() => refetchChats()} // Refresh chats after sending
              disabled={isTyping}
            />
          </div>
        ) : (
          <div className="border-t bg-card/50 backdrop-blur-sm p-4 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Select a chat or create a new one to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  )
}