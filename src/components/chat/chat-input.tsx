import React, { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Loader2 } from "lucide-react"
// import { trpc } from "@/utils/trpc"
import { trpc } from "../../utils/trpc"

interface ChatInputProps {
  chatId: string,
  disabled?: boolean
}


export function ChatInput({ chatId, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const utils = trpc.useContext();


  const sendMessage = trpc.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setMessage("")
      // Invalidate messages so UI refetches (subscription also helps)
      await utils.chat.getMessages.invalidate({ chatId });
      await utils.chat.getChats.invalidate(); // update sidebar
    }
  })

  const handleSend = async () => {
    const trimmedMessage = message.trim()
    // if (!trimmedMessage || sendMessage.isLoading) return

    // sendMessage.isLoading error in ChatInput
    // useMutation() in tRPC v10 returns an object with isPending, not isLoading
    if (!trimmedMessage || sendMessage.isPending) return

    try {
      await sendMessage.mutateAsync({
        chatId,
        content: trimmedMessage,
        role: "user",
      })

      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    } catch (err) {
      console.error("Failed to send message:", err)
    }
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
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your career goals, job search, skills development..."
          // disabled={sendMessage.isLoading}
          disabled={disabled || sendMessage.isPending}
          className="min-h-[48px] max-h-[120px] resize-none bg-background border-input focus:ring-2 focus:ring-ring transition-all duration-200 rounded-xl"
          rows={1}
        />
      </div>
      <Button
        onClick={handleSend}
        // disabled={!message.trim() || sendMessage.isLoading}
        disabled={!message.trim() || sendMessage.isPending}
        size="sm"
        className="h-12 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        {/* {sendMessage.isLoading ? ( */}
        {sendMessage.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}
