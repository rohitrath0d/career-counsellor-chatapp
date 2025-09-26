
import React, { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { trpc } from "../../utils/trpc"
// import { string } from "zod"

interface ChatInputProps {
  chatId: string
  disabled?: boolean
  // onMessageSent?: () => void // Callback for when message is sent
  onMessageSent: (content: string) => void
}

export function ChatInput({ chatId, currentSession, disabled, onMessageSent }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)


  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending || !chatId) return
    setMessage("")

    // Optimistic UI handled by parent via onMessageSent
    onMessageSent(trimmedMessage)   // only call parent callback


    // try {
    //   await sendMessage.mutateAsync({
    //     chatId,
    //     content: trimmedMessage,
    //     role: "user"
    //   })
    // } catch (err) {
    //   console.error("Failed to send message:", err)
    // }

  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    const textarea = e.target
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
  }

  return (
    <div className="flex gap-3 items-end p-4">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your career goals, job search, skills development..."
          disabled={disabled || isSending}
          className="min-h-[48px] max-h-[120px] resize-none bg-background border-input focus:ring-2 focus:ring-ring transition-all duration-200 rounded-xl"
          rows={1}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isSending || !chatId}
        size="sm"
        className="h-12 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}