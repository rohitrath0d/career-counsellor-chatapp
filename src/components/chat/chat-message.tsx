"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Bot, User, Sparkles } from "lucide-react"
import type { Message } from "./chat-interface"
import { cn } from "@/lib/utils"

interface ChatMessagesProps {
  messages: Message[]
  onAddMessage: (content: string, role: "user" | "assistant") => void
  isTyping?: boolean
}

export function ChatMessages({ messages, onAddMessage, isTyping = false }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Welcome message when no messages exist
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Bot className="h-10 w-10 text-primary" />
            <Sparkles className="h-4 w-4 text-secondary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-balance">Welcome to Career Counselor AI</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed text-pretty">
            I'm here to help you navigate your career journey with personalized guidance. Ask me about career paths,
            skill development, job search strategies, or any professional challenges you're facing.
          </p>
          <div className="space-y-3 text-sm">
            <p className="font-medium text-foreground">Try asking:</p>
            <div className="space-y-2">
              {[
                "What career path should I consider with my background in marketing?",
                "How can I improve my resume for tech roles?",
                "What skills should I learn to advance in my current field?",
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => onAddMessage(question, "user")}
                  className="block w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-[1.02] text-sm border border-transparent hover:border-border"
                >
                  "{question}"
                </button>
              ))}
            </div>
          </div>
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
              message.role === "user" ? "justify-end" : "justify-start",
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {message.role === "assistant" && (
              <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
                <AvatarFallback className="bg-transparent">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                message.role === "user"
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-12 rounded-br-md"
                  : "bg-card text-card-foreground border border-border/50 rounded-bl-md",
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-3 opacity-70 font-medium",
                  message.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.role === "user" && (
              <Avatar className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 border-2 border-secondary/20">
                <AvatarFallback className="bg-transparent">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4 justify-start animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/20">
              <AvatarFallback className="bg-transparent">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md p-4 text-sm border border-border/50 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
                <span className="text-muted-foreground ml-2 font-medium">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
