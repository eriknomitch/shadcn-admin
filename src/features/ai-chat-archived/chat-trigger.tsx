import { useEffect, useState, useRef } from 'react'
import { MessageSquare, GripHorizontal } from 'lucide-react'
import { useChatStore } from '@/stores/chat-store'
import { AIChatbot } from '@/components/ai-chatbot'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function ChatTrigger() {
  const { isOpen, toggleChat, closeChat, openChat, messages } = useChatStore()
  const [height, setHeight] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const MIN_HEIGHT = 200
  const MAX_HEIGHT = window.innerHeight * 0.8
  
  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleChat()
      }
      
      // Close chat with Escape key when open
      if (e.key === 'Escape' && isOpen) {
        closeChat()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, toggleChat, closeChat])

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newHeight = window.innerHeight - e.clientY
      setHeight(Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, newHeight)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isResizing, MAX_HEIGHT])

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const unreadCount = messages.filter(msg => msg.role === 'assistant').length

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={openChat}
          size="icon"
          className={cn(
            'fixed bottom-6 right-6 z-40 size-12 rounded-full shadow-lg transition-all hover:scale-105',
            'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
        <div className="relative">
          <MessageSquare className="size-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-2 -top-2 size-4 p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
        <span className="sr-only">Open AI Chat (⌘K)</span>
        </Button>
      )}

      {/* Bottom Resizable Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed bottom-0 right-0 left-0 z-50 bg-background border-t shadow-lg"
          style={{ height: `${height}px` }}
        >
          {/* Resize Handle */}
          <div
            className={cn(
              'absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-primary/20 transition-colors',
              'flex items-center justify-center group'
            )}
            onMouseDown={handleResizeStart}
          >
            <div className="w-12 h-1 bg-border rounded-full group-hover:bg-primary/40 transition-colors" />
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={closeChat}
            className="absolute top-2 right-2 z-10"
          >
            ×
          </Button>

          {/* Chat Content */}
          <div className="h-full pt-4">
            <AIChatbot />
          </div>
        </div>
      )}

      {/* Keyboard shortcut hint (only show when chat is closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-30 opacity-0 transition-opacity hover:opacity-100">
          <div className="rounded-lg bg-popover p-2 text-xs text-popover-foreground shadow-md">
            Press <kbd className="rounded bg-muted px-1">⌘K</kbd> to open chat
          </div>
        </div>
      )}
    </>
  )
}