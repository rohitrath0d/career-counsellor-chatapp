// import React, { useState, useRef, type KeyboardEvent } from "react"
// import { Button } from "../ui/button"
// import { Textarea } from "../ui/textarea"
// import { Send, Loader2 } from "lucide-react"

// interface ChatInputProps {
//   onSendMessage: (content: string) => void
//   disabled?: boolean
// }

// export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
//   const [message, setMessage] = useState("")
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const [isSending, setIsSending] = useState(false)

//   const handleSend = async () => {
//     const trimmedMessage = message.trim()
//     if (!trimmedMessage || isSending) return

//     setIsSending(true)
//     try {
//       await onSendMessage(trimmedMessage)
//       setMessage("")
//       if (textareaRef.current) {
//         textareaRef.current.style.height = "auto"
//       }
//     } catch (err) {
//       console.error("Failed to send message:", err)
//     } finally {
//       setIsSending(false)
//     }
//   }

//   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setMessage(e.target.value)
//     const textarea = e.target
//     textarea.style.height = "auto"
//     textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
//   }

//   return (
//     <div className="flex gap-3 items-end">
//       <div className="flex-1">
//         <Textarea
//           ref={textareaRef}
//           value={message}
//           onChange={handleTextareaChange}
//           onKeyDown={handleKeyDown}
//           placeholder="Ask me about your career goals, job search, skills development..."
//           disabled={disabled || isSending}
//           className="min-h-[48px] max-h-[120px] resize-none bg-background border-input focus:ring-2 focus:ring-ring transition-all duration-200 rounded-xl"
//           rows={1}
//         />
//       </div>
//       <Button
//         onClick={handleSend}
//         disabled={!message.trim() || isSending}
//         size="sm"
//         className="h-12 px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
//       >
//         {isSending ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <Send className="h-4 w-4" />
//         )}
//         <span className="sr-only">Send message</span>
//       </Button>
//     </div>
//   )
// }


// components/chat/chat-input.tsx
import React, { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { trpc } from "../../utils/trpc"

interface ChatInputProps {
  chatId: string
  disabled?: boolean
  onMessageSent?: () => void // Callback for when message is sent
}

export function ChatInput({ chatId, disabled, onMessageSent }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const utils = trpc.useContext()

  // Mutation to send message
  const sendMessage = trpc.chat.sendMessage.useMutation({
    onMutate: () => {
      setIsSending(true)
    },
    onSuccess: () => {
      setIsSending(false)
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
      
      // Invalidate queries to refresh the messages
      utils.chat.getMessages.invalidate({ chatId })
      utils.chat.getChats.invalidate()
      
      // Call the callback if provided
      if (onMessageSent) {
        onMessageSent()
      }
    },
    onError: (error) => {
      setIsSending(false)
      console.error("Failed to send message:", error)
      // You might want to show an error toast here
    },
  })

  const handleSend = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isSending || !chatId) return

    try {
      await sendMessage.mutateAsync({
        chatId,
        content: trimmedMessage,
        role: "user"
      })
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
    <div className="flex gap-3 items-end p-4 border-t bg-card/50 backdrop-blur-sm">
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