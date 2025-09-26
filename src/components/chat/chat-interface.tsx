"use client"

import { useState, useEffect, useRef } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ThemeToggle } from "../theme/theme-toggle"
import { Button } from "../ui/button"
import { Menu, Bot } from "lucide-react"
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
  const [messages, setMessages] = useState<Message[]>([])  // <- separate state for live updates

  const [isTyping, setIsTyping] = useState(false)


  // Track processed message IDs to prevent duplicates
  const processedMessageIds = useRef<Set<string>>(new Set())
  const isInitialLoad = useRef(true)

  // Create a ref to always have the latest session
  const currentSessionRef = useRef<ChatSession | null>(currentSession);


  const utils = trpc.useContext();
  // Fetch user's chats from backend
  const { data: backendChats = [], refetch: refetchChats } = trpc.chat.getChats.useQuery()

  // DEBUG: Log the exact structure
  console.log("Backend chats structure:", {
    isArray: Array.isArray(backendChats),
    type: typeof backendChats,
    keys: backendChats ? Object.keys(backendChats) : 'null',
    fullObject: backendChats
  });

  // Fetch messages for current chat
  // Polling (useQuery with refetchInterval)
  // const { data: newMessages } = trpc.chat.getMessages.useQuery(
  //   currentSession
  //     ? {
  //       // chatId: currentSession?.id || '',
  //       chatId: currentSession?.id,
  //       // lastMessageId: currentSession?.messages[currentSession.messages.length - 1]?.id,
  //       skip: 0,
  //       take: 50
  //     }
  //     : undefined,  // passing undefined disables the query
  //   {
  //     enabled: !!currentSession?.id,  // ensures query only runs when chatId exists
  //     // refetchInterval: 2000, // Poll every 2 seconds
  //     refetchOnWindowFocus: false,
  //     refetchInterval: false, // only manual/refetch
  //   }
  // );



  // Map backend chats to frontend sessions
  useEffect(() => {
    console.log("Backend chats received:", backendChats);
    if (!backendChats || !isInitialLoad.current) return;

    const chatsArray = Array.isArray(backendChats) ? backendChats : [];
    console.log("Extracted chats array:", chatsArray);
    console.log("Array length:", chatsArray.length);


    // if (backendChats && Array.isArray(backendChats) && backendChats.length > 0) {
    if (chatsArray.length > 0) {
      // const mappedSessions = backendChats.map(chat => ({
      const mappedSessions = chatsArray.map(chat => ({
        id: chat.id,
        title: chat.title,
        messages: chat.messages ? chat.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          // role: msg.sender as "user" | "assistant",
          // Map prisma sender ('user' | 'ai') to UI role ('user' | 'assistant')
          role: (msg.sender === "ai" ? "assistant" : "user") as "user" | "assistant",
          timestamp: new Date(msg.createdAt)
        })) : [],
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt)
      }));

      console.log("Mapped sessions:", mappedSessions);

      setSessions(mappedSessions);
      if (!currentSession && mappedSessions.length > 0) {
        setCurrentSession(mappedSessions[0]);
        setMessages(mappedSessions[0].messages) // <- initialize live messages
      }
      isInitialLoad.current = false
    }
  }, [backendChats]);

  // Subscribe to new messages for the current chat (web socket)
  // trpc.chat.newMessages.useSubscription(
  //   // currentSession ? { chatId: currentSession?.id } : undefined,
  //   { chatId: currentSession?.id || "" },
  //   {
  //     enabled: !!currentSession?.id,      // only subscribes when session exists

  //     onData: (data) => {
  //       if (!currentSession) return;

  //       // // Extract the payload from the nested structure
  //       const payload = data.result?.data;
  //       if (!payload) return;

  //       // // Update React Query cache for current messages
  //       // utils.chat.getMessages.setData({ chatId: currentSession.id }, (prev) => {
  //       //   const updated = prev ? [...prev] : [];

  //       //   // Add user message if new
  //       //   if (payload.user && !updated.some(m => m.id === payload.user.id)) {
  //       //     updated.push({
  //       //       id: payload.user.id,
  //       //       content: payload.user.content,
  //       //       role: "user",
  //       //       timestamp: new Date(payload.user.createdAt),
  //       //     });
  //       //   }

  //       //   // Add AI message if new
  //       //   if (payload.ai && !updated.some(m => m.id === payload.ai.id)) {
  //       //     updated.push({
  //       //       id: payload.ai.id,
  //       //       content: payload.ai.content,
  //       //       role: "assistant",
  //       //       timestamp: new Date(payload.ai.createdAt),
  //       //     });
  //       //     setIsTyping(false); // AI has responded
  //       //   } else if (payload.ai && !payload.ai.content) {
  //       //     setIsTyping(true); // AI is typing
  //       //   }

  //       //   return updated;
  //       // });

  //       setCurrentSession((prev) => {
  //         if (!prev) return prev;

  //         const updatedMessages = [...prev.messages];

  //         if (payload.user && !updatedMessages.some(m => m.id === payload.user.id)) {
  //           updatedMessages.push({
  //             id: payload.user.id,
  //             content: payload.user.content,
  //             role: "user",
  //             timestamp: new Date(payload.user.createdAt),
  //           });
  //         }

  //         if (payload.ai && !updatedMessages.some(m => m.id === payload.ai.id)) {
  //           updatedMessages.push({
  //             id: payload.ai.id,
  //             content: payload.ai.content,
  //             role: "assistant",
  //             timestamp: new Date(payload.ai.createdAt),
  //           });
  //           setIsTyping(false);
  //         }

  //         return {
  //           ...prev,
  //           messages: updatedMessages,
  //           updatedAt: new Date(),
  //         };
  //       })
  //     }
  //   }
  // );



  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);


  // Subscribe to new messages for the current chat (live updates)
  trpc.chat.newMessages.useSubscription(
    { chatId: currentSession?.id || "" },
    {
      enabled: !!currentSession?.id,
      onData: (data) => {
        const session = currentSessionRef.current;
        if (!data || !session) return;

        console.log("Live WebSocket data:", data);

        const newMessages: Message[] = [];

        if (data.user && !processedMessageIds.current.has(data.user.id)) {
          newMessages.push({
            id: data.user.id,
            content: data.user.content,
            role: "user",
            timestamp: new Date(data.user.createdAt),
          });
          processedMessageIds.current.add(data.user.id);
        }

        if (data.ai && !processedMessageIds.current.has(data.ai.id)) {
          newMessages.push({
            id: data.ai.id,
            content: data.ai.content,
            role: "assistant",
            timestamp: new Date(data.ai.createdAt),
          });
          processedMessageIds.current.add(data.ai.id);
          setIsTyping(false);
        } else if (data.ai && !data.ai.content) {
          setIsTyping(true);
        }

        if (newMessages.length === 0) return;

        // Update session in place
        setCurrentSession((prev) =>
          prev && prev.id === session.id
            ? { ...prev, messages: [...prev.messages, ...newMessages] }
            : prev
        );

        // Update sidebar sessions
        setSessions((prev) =>
          prev.map((s) =>
            s.id === session.id
              ? { ...s, messages: [...s.messages, ...newMessages] }
              : s
          )
        );
      },
    }
  );


  // Mutation to start a new chat
  const startChat = trpc.chat.startChat.useMutation({
    onSuccess: (chat) => {
      //   setIsTyping(true)
      //   console.log("Chat created successfully:", chat);
      //   refetchChats();
      //   processedMessageIds.current.clear();
      //   setIsTyping(false)
      // },

      const newSession: ChatSession = {
        id: chat.id,
        title: chat.title,
        messages: [],
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSession(newSession);
      processedMessageIds.current.clear();
    },

    onError: (error) => {
      console.error("Failed to create chat:", error.data);
    },
  });

  // Mutation to send message
  const sendMessage = trpc.chat.sendMessage.useMutation({
    onMutate: () => setIsTyping(true),
    onSuccess: (response) => {
      setIsTyping(false);
      // refetchChats(); // Refresh to get updated messages

      // Add the sent message IDs to processed set
      if (response?.user?.id) {
        processedMessageIds.current.add(response.user.id);
      }
      if (response?.ai?.id) {
        processedMessageIds.current.add(response.ai.id);
      }

      // If using polling, manually refetch messages
      // refetchMessages();

      // Immediately merge AI reply into current session so UI updates
      if (response?.ai && currentSessionRef.current) {
        const aiMsg: Message = {
          id: response.ai.id,
          content: response.ai.content,
          role: "assistant",
          timestamp: new Date(response.ai.createdAt),
        };

        // Update current session view
        setCurrentSession((prev) =>
          prev && prev.id === currentSessionRef.current!.id
            ? { ...prev, messages: [...prev.messages, aiMsg], updatedAt: new Date() }
            : prev
        );

        // Update sidebar sessions list
        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSessionRef.current!.id
              ? { ...s, messages: [...s.messages, aiMsg], updatedAt: new Date() }
              : s
          )
        );
      }

    },
    onError: () => setIsTyping(false),
  });

  // Mutation to delete chat
  const deleteChat = trpc.chat.deleteChat.useMutation({
    // onSuccess: () => {
    //   refetchChats();
    //   processedMessageIds.current.clear();
    // },

    onSuccess: (_, { chatId }: { chatId: string }) => {
      setSessions((prev) => prev.filter((s) => s.id !== chatId));

      setCurrentSession((prev) =>
        prev && prev.id === chatId
          ? sessions.length > 1
            ? sessions.find((s) => s.id !== chatId) || null
            : null
          : prev
      );

      processedMessageIds.current.clear();
    },
    onError: (error) => {
      console.error("Failed to delete chat:", error.data);
    },

  });

  const createNewSession = () => {
    console.log("Creating new session...");
    startChat.mutate({
      title: "New Career Chat"
    });
    console.log("Creating new created...");
  }

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session)
    setSidebarOpen(false)

    processedMessageIds.current.clear();

    // If using polling, refetch messages for the new session
    // refetchMessages();
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

    // if (role === "user") {
    //   // Send user message to backend
    //   sendMessage.mutate({
    //     chatId: currentSession.id,
    //     content,
    //     role: "user"
    //   });

    // Optimistically add user message to UI
    const tempId = `temp-${Date.now()}`;

    const userMessage: Message = {
      // id: `temp-${Date.now()}`,
      id: tempId,
      content,
      // role: "user",
      role,
      timestamp: new Date()
    };

    processedMessageIds.current.add(tempId);


    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date()
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s =>
      s.id === updatedSession.id ? updatedSession : s
    ));

    // Send to backend via TRPC mutation **only once**
    sendMessage.mutate({
      chatId: currentSession.id,
      content,
      role: "user"
    });

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
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 overflow-y-auto"}
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
        <div className="flex-1 overflow-y-auto">
          <ChatMessages
            messages={currentSession?.messages || []}
            // onAddMessage={addMessage}
            isTyping={isTyping}
          />
        </div>

        {/* Chat input */}
        {/* <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <ChatInput
            chatId={currentSession.id || ''}      // The issue is in this line: When currentSession is null, currentSession.id throws an error because we can't access properties of null. we need to use optional chaining
            onMessageSent={() => refetchChats()} // Refresh chats after sending
            // onMessageSent={(content) => addMessage(content, "user")}
            disabled={isTyping}
          />
        </div> */}

        {/* {currentSession ? (
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
        )} */}

        <div className=" bg-card/50 backdrop-blur-sm p-4">
          {currentSession ? (
            <ChatInput
              chatId={currentSession.id}
              // onMessageSent={() => refetchChats()}
              onMessageSent={(content: string) => addMessage(content, "user")}
              disabled={isTyping}
            />
          ) : (
            <div className="flex items-center justify-center h-16">
              <p className="text-muted-foreground text-sm">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}