"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-message"
import { ChatInput } from "./chat-input"
import { ThemeToggle } from "../theme/theme-toggle"
import { Button } from "../ui/button"
import { Menu, Bot } from "lucide-react"
import { generateAIResponse } from "@/lib/ai-responses"
import { saveSessions, loadSessions } from "@/lib/storage"

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
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadedSessions = loadSessions()
    setSessions(loadedSessions)
    setIsLoaded(true)
  }, [])

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (isLoaded) {
      saveSessions(sessions)
    }
  }, [sessions, isLoaded])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Career Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession)
  }

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session)
    setSidebarOpen(false)
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
    if (currentSession?.id === sessionId) {
      setCurrentSession(null)
    }
  }

  const addMessage = (content: string, role: "user" | "assistant") => {
    if (!currentSession) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setSessions((prev) => [newSession, ...prev])
      setCurrentSession(newSession)

      // Add the user message to the new session
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role,
        timestamp: new Date(),
      }

      const updatedSession = {
        ...newSession,
        messages: [userMessage],
        updatedAt: new Date(),
      }

      setCurrentSession(updatedSession)
      setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))

      // Generate AI response if user message
      if (role === "user") {
        handleAIResponse(content, updatedSession)
      }
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      updatedAt: new Date(),
      title:
        currentSession.messages.length === 0
          ? content.slice(0, 50) + (content.length > 50 ? "..." : "")
          : currentSession.title,
    }

    setCurrentSession(updatedSession)
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))

    // Generate AI response if user message
    if (role === "user") {
      handleAIResponse(content, updatedSession)
    }
  }

  const handleAIResponse = async (userMessage: string, session: ChatSession) => {
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const aiResponse = generateAIResponse(userMessage)

    const aiMessage: Message = {
      id: Date.now().toString(),
      content: aiResponse,
      role: "assistant",
      timestamp: new Date(),
    }

    const updatedSession = {
      ...session,
      messages: [...session.messages, aiMessage],
      updatedAt: new Date(),
    }

    setCurrentSession(updatedSession)
    setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))
    setIsTyping(false)
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
          onDeleteSession={deleteSession}
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
          <ChatMessages messages={currentSession?.messages || []} onAddMessage={addMessage} isTyping={isTyping} />
        </div>

        {/* Chat input */}
        <div className="border-t bg-card/50 backdrop-blur-sm p-4">
          <ChatInput onSendMessage={(content) => addMessage(content, "user")} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}
