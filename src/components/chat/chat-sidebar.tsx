
"use client"

import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Plus, MessageSquare, X, Trash2, MoreHorizontal } from "lucide-react"
import { ChatSession } from "./chat-interface"
// import { cn } from "@/lib/utils"
import { cn } from "../../lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { useState } from "react"

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  onSelectSession: (session: ChatSession) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  onClose: () => void
}

export function ChatSidebar({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClose,
}: ChatSidebarProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete)
      setSessionToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="h-full bg-sidebar/95 backdrop-blur-sm border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Chat History</h2>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={onNewSession}
          className="w-full bg-gradient-to-r from-sidebar-primary to-sidebar-primary/90 hover:from-sidebar-primary/90 hover:to-sidebar-primary text-sidebar-primary-foreground transition-all duration-200 hover:scale-[1.02] rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Sessions list */}
      <ScrollArea className="flex-1 p-2">
        {sessions.length === 0 ? (
          <div className="text-center py-12 text-sidebar-foreground/60">
            <div className="w-12 h-12 bg-sidebar-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-sidebar-primary/60" />
            </div>
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs mt-1 opacity-80">Start a new chat to begin your career journey</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className={cn(
                  "group relative rounded-xl transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4",
                  currentSession?.id === session.id && "bg-sidebar-accent/80 shadow-sm",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left p-4 h-auto hover:bg-sidebar-accent/60 pr-12 rounded-xl transition-all duration-200",
                    currentSession?.id === session.id && "bg-sidebar-accent/80 text-sidebar-accent-foreground",
                  )}
                  onClick={() => onSelectSession(session)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate leading-tight">{session.title}</p>
                    <p className="text-xs text-sidebar-foreground/60 mt-1.5 font-medium">
                      {session.messages.length} messages • {formatDate(session.updatedAt)}
                    </p>
                  </div>
                </Button>

                {/* Delete button */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-sidebar-accent rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive rounded-lg"
                        onClick={(e) => handleDeleteClick(session.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50">
        <p className="text-xs text-sidebar-foreground/60 text-center font-medium">AI Career Counselor v1.0</p>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90 rounded-lg">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return "Today"
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString()
  }
}