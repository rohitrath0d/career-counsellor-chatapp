// // "use client"

// import { useEffect, useRef } from "react"
// import { ScrollArea } from "../ui/scroll-area"
// import { Avatar, AvatarFallback } from "../ui/avatar"
// import { Bot, User, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { trpc } from "@/utils/trpc"

// interface ChatMessagesProps {
//   chatId: string
//   isTyping?: boolean
// }

// export function ChatMessages({ chatId, isTyping = false }: ChatMessagesProps) {
//   const scrollAreaRef = useRef<HTMLDivElement>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // fetch messages
//   const { data: messages = [], refetch } = trpc.chat.getMessages.useQuery(
//     { chatId, skip: 0, take: 50 },
//     { refetchOnWindowFocus: false }
//   )

//   // subscribe to realtime new messages
//   trpc.chat.onNewMessage.useSubscription({ chatId }, {
//     onData: () => {
//       refetch()
//     }
//   })

//   // Auto-scroll when new messages or typing indicator
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, isTyping])

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
//             <Bot className="h-10 w-10 text-primary" />
//             <Sparkles className="h-4 w-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
//           </div>
//           <h3 className="text-2xl font-bold mb-3">Welcome to Career Counselor AI</h3>
//           <p className="text-muted-foreground mb-8 leading-relaxed">
//             I'm here to help you navigate your career journey with personalized guidance.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
//       <div className="space-y-6 max-w-4xl mx-auto">
//         {messages.map((message, index) => (
//           <div
//             key={message.id}
//             className={cn(
//               "flex gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
//               message.sender === "user" ? "justify-end" : "justify-start"
//             )}
//             style={{ animationDelay: `${index * 50}ms` }}
//           >
//             {message.sender === "ai" && (
//               <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
//                 <AvatarFallback className="bg-transparent">
//                   <Bot className="h-5 w-5 text-primary-foreground" />
//                 </AvatarFallback>
//               </Avatar>
//             )}

//             <div
//               className={cn(
//                 "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
//                 message.sender === "user"
//                   ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-12 rounded-br-md"
//                   : "bg-card text-card-foreground border border-border/50 rounded-bl-md"
//               )}
//             >
//               <p className="whitespace-pre-wrap">{message.content}</p>
//               <p
//                 className={cn(
//                   "text-xs mt-3 opacity-70 font-medium",
//                   message.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
//                 )}
//               >
//                 {formatTime(new Date(message.createdAt))}
//               </p>
//             </div>

//             {message.sender === "user" && (
//               <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 border-2 border-secondary/20">
//                 <AvatarFallback className="bg-transparent">
//                   <User className="h-5 w-5 text-secondary-foreground" />
//                 </AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex gap-4 justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
//             <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
//               <AvatarFallback className="bg-transparent">
//                 <Bot className="h-5 w-5 text-primary-foreground" />
//               </AvatarFallback>
//             </Avatar>
//             <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md p-4 text-sm border border-border/50 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
//                 </div>
//                 <span className="text-muted-foreground ml-2 font-medium">AI is thinking...</span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>
//     </ScrollArea>
//   )
// }

// function formatTime(date: Date): string {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// }


// import { useEffect, useRef } from "react"
// import { ScrollArea } from "../ui/scroll-area"
// import { Avatar, AvatarFallback } from "../ui/avatar"
// import { Bot, User, Sparkles } from "lucide-react"
// import { cn } from "@/lib/utils"

// interface ChatMessagesProps {
//   messages: {
//     id: string
//     sender: "user" | "ai"
//     content: string
//     createdAt: string
//   }[]
//   isTyping?: boolean
// }

// export function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
//   const scrollAreaRef = useRef<HTMLDivElement>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // Auto-scroll when new messages or typing indicator
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, isTyping])

//   if (messages.length === 0) {
//     return (
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="text-center max-w-md">
//           <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
//             <Bot className="h-10 w-10 text-primary" />
//             <Sparkles className="h-4 w-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
//           </div>
//           <h3 className="text-2xl font-bold mb-3">Welcome to Career Counselor AI</h3>
//           <p className="text-muted-foreground mb-8 leading-relaxed">
//             {/* I'm here to help you navigate your career journey with personalized guidance. */}
//             I&apos;m here to help you navigate your career journey with personalized guidance.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
//       <div className="space-y-6 max-w-4xl mx-auto">
//         {messages.map((message, index) => (
//           <div
//             key={message.id}
//             className={cn(
//               "flex gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
//               message.sender === "user" ? "justify-end" : "justify-start"
//             )}
//             style={{ animationDelay: `${index * 50}ms` }}
//           >
//             {message.sender === "ai" && (
//               <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
//                 <AvatarFallback className="bg-transparent">
//                   <Bot className="h-5 w-5 text-primary-foreground" />
//                 </AvatarFallback>
//               </Avatar>
//             )}

//             <div
//               className={cn(
//                 "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
//                 message.sender === "user"
//                   ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-12 rounded-br-md"
//                   : "bg-card text-card-foreground border border-border/50 rounded-bl-md"
//               )}
//             >
//               <p className="whitespace-pre-wrap">{message.content}</p>
//               <p
//                 className={cn(
//                   "text-xs mt-3 opacity-70 font-medium",
//                   message.sender === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
//                 )}
//               >
//                 {formatTime(new Date(message.createdAt))}
//               </p>
//             </div>

//             {message.sender === "user" && (
//               <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 border-2 border-secondary/20">
//                 <AvatarFallback className="bg-transparent">
//                   <User className="h-5 w-5 text-secondary-foreground" />
//                 </AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex gap-4 justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
//             <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
//               <AvatarFallback className="bg-transparent">
//                 <Bot className="h-5 w-5 text-primary-foreground" />
//               </AvatarFallback>
//             </Avatar>
//             <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md p-4 text-sm border border-border/50 shadow-sm">
//               <div className="flex items-center gap-2">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
//                   <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
//                 </div>
//                 <span className="text-muted-foreground ml-2 font-medium">AI is thinking...</span>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>
//     </ScrollArea>
//   )
// }

// function formatTime(date: Date): string {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
// }


import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Bot, User, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils"
import { trpc } from "../../utils/trpc"
import { Message } from "@prisma/client"

interface ChatMessagesProps {
  chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
  // const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const utils = trpc.useUtils()


  // Initial messages
  // const { data: messages = [] } = trpc.chat.getMessages.useQuery(
  //   { chatId, skip: 0, take: 50 },
  //   { enabled: !!chatId }
  // )

  // fetch users chats
  const { data: initialMessages = [] } = trpc.chat.getMessages.useQuery(
    { chatId, skip: 0, take: 50 },
    {
      enabled: !!chatId,
      //  onSuccess: setMessages 
    }
  );

  // Update state when data changes
  useEffect(() => {
    if (initialMessages.length) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // Subscription for new messages
  // trpc.chat.onNewMessage.useSubscription(
  trpc.chat.newMessages.useSubscription(
    { chatId },
    {
      enabled: !!chatId,
      onData: ({ user, ai }) => {
        // onData: (data) => {
        // trpc.chat.getMessages.invalidate({ chatId })
        // utils.chat.getMessages.invalidate({ chatId })
        // refetchChats()
        // if (refetchChats) refetchChats();
        // setMessages((prev) => [...prev, user, ai]);     //  This avoids calling utils.chat.getMessages.invalidate every time, which can save unnecessary queries.
        setMessages((prev) => {
          const newMessages = [user, ai].filter(m => !prev.some(msg => msg.id === m.id));
          return [...prev, ...newMessages].slice(-200);
        });

      },
    }
  )

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!chatId) {
    return <div className="flex-1 flex items-center justify-center">Select a chat</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Bot className="h-10 w-10 text-primary" />
            <Sparkles className="h-4 w-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Welcome to Career Counselor AI</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {/* I'm here to help you navigate your career journey with personalized guidance. */}
            I&aposm here to help you navigate your career journey with personalized guidance.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {message.sender === "ai" && (
              <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
                <AvatarFallback className="bg-transparent">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                message.sender === "user"
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-12 rounded-br-md"
                  : "bg-card text-card-foreground border border-border/50 rounded-bl-md"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-3 opacity-70 font-medium",
                  message.sender === "user"
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                )}
              >
                {formatTime(new Date(message.createdAt))}
              </p>
            </div>

            {message.sender === "user" && (
              <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 border-2 border-secondary/20">
                <AvatarFallback className="bg-transparent">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}