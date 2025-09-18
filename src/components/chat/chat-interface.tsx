// // "use client"

// import { useState, useEffect } from "react"
// import { ChatSidebar } from "./chat-sidebar"
// import { ChatMessages } from "./chat-message"
// import { ChatInput } from "./chat-input"
// import { ThemeToggle } from "../theme/theme-toggle"
// import { Button } from "../ui/button"
// import { Menu, Bot } from "lucide-react"
// import { generateAIResponse } from "@/lib/ai-responses"
// import { saveSessions, loadSessions } from "@/lib/storage"

// export interface Message {
//   id: string
//   content: string
//   role: "user" | "assistant"
//   timestamp: Date
// }

// export interface ChatSession {
//   id: string
//   title: string
//   messages: Message[]
//   createdAt: Date
//   updatedAt: Date
// }

// export function ChatInterface() {
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
//   const [sessions, setSessions] = useState<ChatSession[]>([])
//   const [isTyping, setIsTyping] = useState(false)
//   const [isLoaded, setIsLoaded] = useState(false)

//   // Load sessions from localStorage on mount
//   useEffect(() => {
//     const loadedSessions = loadSessions()
//     setSessions(loadedSessions)
//     setIsLoaded(true)
//   }, [])

//   // Save sessions to localStorage whenever sessions change
//   useEffect(() => {
//     if (isLoaded) {
//       saveSessions(sessions)
//     }
//   }, [sessions, isLoaded])

//   const createNewSession = () => {
//     const newSession: ChatSession = {
//       id: Date.now().toString(),
//       title: "New Career Chat",
//       messages: [],
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }
//     setSessions((prev) => [newSession, ...prev])
//     setCurrentSession(newSession)
//   }

//   const selectSession = (session: ChatSession) => {
//     setCurrentSession(session)
//     setSidebarOpen(false)
//   }

//   const deleteSession = (sessionId: string) => {
//     setSessions((prev) => prev.filter((session) => session.id !== sessionId))
//     if (currentSession?.id === sessionId) {
//       setCurrentSession(null)
//     }
//   }

//   const addMessage = (content: string, role: "user" | "assistant") => {
//     if (!currentSession) {
//       const newSession: ChatSession = {
//         id: Date.now().toString(),
//         title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
//         messages: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       }
//       setSessions((prev) => [newSession, ...prev])
//       setCurrentSession(newSession)

//       // Add the user message to the new session
//       const userMessage: Message = {
//         id: Date.now().toString(),
//         content,
//         role,
//         timestamp: new Date(),
//       }

//       const updatedSession = {
//         ...newSession,
//         messages: [userMessage],
//         updatedAt: new Date(),
//       }

//       setCurrentSession(updatedSession)
//       setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))

//       // Generate AI response if user message
//       if (role === "user") {
//         handleAIResponse(content, updatedSession)
//       }
//       return
//     }

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       content,
//       role,
//       timestamp: new Date(),
//     }

//     const updatedSession = {
//       ...currentSession,
//       messages: [...currentSession.messages, newMessage],
//       updatedAt: new Date(),
//       title:
//         currentSession.messages.length === 0
//           ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
//           : currentSession.title,
//     }

//     setCurrentSession(updatedSession)
//     setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))

//     // Generate AI response if user message
//     if (role === "user") {
//       handleAIResponse(content, updatedSession)
//     }
//   }

//   const handleAIResponse = async (userMessage: string, session: ChatSession) => {
//     setIsTyping(true)

//     // Simulate AI thinking time
//     await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

//     const aiResponse = generateAIResponse(userMessage)

//     const aiMessage: Message = {
//       id: Date.now().toString(),
//       content: aiResponse,
//       role: "assistant",
//       timestamp: new Date(),
//     }

//     const updatedSession = {
//       ...session,
//       messages: [...session.messages, aiMessage],
//       updatedAt: new Date(),
//     }

//     setCurrentSession(updatedSession)
//     setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))
//     setIsTyping(false)
//   }

//   return (
//     <div className="flex h-full bg-background">
//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//       `}
//       >
//         <ChatSidebar
//           sessions={sessions}
//           currentSession={currentSession}
//           onSelectSession={selectSession}
//           onNewSession={createNewSession}
//           onDeleteSession={deleteSession}
//           onClose={() => setSidebarOpen(false)}
//         />
//       </div>

//       {/* Main chat area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
//               <Menu className="h-5 w-5" />
//             </Button>
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Bot className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-primary">Career Counselor AI</h1>
//                 <p className="text-sm text-muted-foreground">Your AI-powered career guidance assistant</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//           </div>
//         </header>

//         {/* Chat messages */}
//         <div className="flex-1 overflow-hidden">
//           <ChatMessages messages={currentSession?.messages || []} onAddMessage={addMessage} isTyping={isTyping} />
//         </div>

//         {/* Chat input */}
//         <div className="border-t bg-card/50 backdrop-blur-sm p-4">
//           <ChatInput onSendMessage={(content) => addMessage(content, "user")} disabled={isTyping} />
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { trpc } from "@/lib/trpc"
// import { ChatMessages } from "./chat-message"
// import { ChatInput } from "./chat-input"
// import { Button } from "../ui/button"
// import type { Chat } from "@prisma/client"

// export interface Message {
//   id: string
//   content: string
//   role: "user" | "assistant"
//   timestamp: Date
// }

// export default function ChatInterface() {
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
//   const [isSending, setIsSending] = useState(false)

//   // Fetch user's chats
//   const { data: chats, refetch: refetchChats } = trpc.chat.getChats.useQuery()

//   // Fetch messages for selected chat
//   const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
//     { chatId: selectedChatId! },
//     { enabled: !!selectedChatId }
//   )

//   // Mutation to send message
//   const sendMessage = trpc.chat.sendMessage.useMutation({
//     onMutate: () => setIsSending(true),
//     onSuccess: () => {
//       setIsSending(false)
//       refetchMessages()
//       refetchChats()
//     },
//     onError: () => setIsSending(false),
//   })

//   // Mutation to start a new chat
//   const startChat = trpc.chat.startChat.useMutation({
//     onSuccess: (chat: Chat) => {
//       setSelectedChatId(chat.id)
//       refetchChats()
//     },
//   })

//   const handleSendMessage = (content: string) => {
//     if (!selectedChatId) return
//     sendMessage.mutate({ chatId: selectedChatId, content })
//   }

//   const handleAddMessage = (content: string, role: "user" | "assistant") => {
//     // Only local add for quick UX (optional)
//     handleSendMessage(content)
//   }

//   return (
//     <div className="flex h-full w-full">
//       {/* Sidebar */}
//       <div className="w-64 border-r border-border p-4 flex flex-col">
//         <Button
//           className="mb-4"
//           onClick={() => startChat.mutate({ title: "New Career Chat" })}
//         >
//           New Chat
//         </Button>
//         <div className="flex-1 overflow-y-auto space-y-2">
//           {chats?.map((chat) => (
//             <button
//               key={chat.id}
//               onClick={() => setSelectedChatId(chat.id)}
//               className={`block w-full text-left p-2 rounded-lg ${
//                 chat.id === selectedChatId ? "bg-primary text-primary-foreground" : "hover:bg-muted"
//               }`}
//             >
//               {chat.title}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col">
//         {selectedChatId ? (
//           <>
//             <ChatMessages
//               messages={
//                 messages?.map((m) => ({
//                   id: m.id,
//                   content: m.content,
//                   role: m.sender as "user" | "assistant",
//                   timestamp: m.createdAt,
//                 })) ?? []
//               }
//               onAddMessage={handleAddMessage}
//               isTyping={isSending}
//             />
//             <div className="p-4">
//               <ChatInput onSendMessage={handleSendMessage} disabled={isSending} />
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-muted-foreground">
//             Select a chat or start a new one
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

import { useState } from "react"
import { trpc } from "@/utils/trpc"
import { ChatMessages } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Button } from "../ui/button"
import type { Chat } from "@prisma/client"


export default function ChatInterface() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const utils = trpc.useUtils()

  // Fetch user's chats
  const { data: chats, refetch: refetchChats } = trpc.chat.getChats.useQuery()

  // Fetch messages for selected chat
  // const { data: messages = [] } = trpc.chat.getMessages.useQuery(
  //   { chatId: selectedChatId! },
  //   { enabled: !!selectedChatId }
  // )

  const startChat = trpc.chat.startChat.useMutation({
    onSuccess: (chat) => {
      setSelectedChatId(chat.id);
      refetchChats();
    },
  });

  // Subscribe to new messages
  // trpc.chat.onNewMessage.useSubscription(
  // trpc.chat.newMessages.useSubscription(
  //   { chatId: selectedChatId! },
  //   {
  //     enabled: !!selectedChatId,
  //     onData: () => {
  //       // Just invalidate cache so TanStack Query refetches
  //       // (or we could manually append, but invalidate is simpler)
  //       if (selectedChatId) {
  //         // trpc.chat.getMessages.invalidate({ chatId: selectedChatId })
  //         utils.chat.getMessages.invalidate({ chatId: selectedChatId })
  //       }
  //       refetchChats()
  //     },
  //   }
  // )



  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 flex flex-col">
        <Button
          className="mb-4"
          onClick={() => startChat.mutate({ title: "New Career Chat" })}
        >
          New Chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {chats?.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`block w-full text-left p-2 rounded-lg ${chat.id === selectedChatId
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
                }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {/* <div className="flex-1 flex flex-col"> */}
      <main className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            <ChatMessages chatId={selectedChatId} />
            <div className="p-4">
              <ChatInput chatId={selectedChatId} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat or start a new one
          </div>
        )}
        {/* </div> */}
      </main>
    </div>
  )
}
