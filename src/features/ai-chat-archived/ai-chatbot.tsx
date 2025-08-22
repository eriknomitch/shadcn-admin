import React, { useEffect, useRef } from 'react'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import { useChatStore, type Message } from '@/stores/chat-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: Message
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={cn('flex gap-3 p-4', isUser && 'flex-row-reverse')}>
      <Avatar className="size-8">
        <AvatarFallback className={cn(
          'text-xs',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
        )}>
          {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn('flex flex-col gap-2 max-w-[80%]', isUser && 'items-end')}>
        <div className={cn(
          'rounded-lg px-3 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}>
          {message.isStreaming ? (
            <div className="flex items-center gap-1">
              <span>{message.content}</span>
              <div className="animate-pulse">▋</div>
            </div>
          ) : (
            <span>{message.content}</span>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  )
}

function LoadingMessage() {
  return (
    <div className="flex gap-3 p-4">
      <Avatar className="size-8">
        <AvatarFallback className="bg-muted text-muted-foreground">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3 animate-spin" />
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AIChatbot() {
  const {
    messages,
    currentMessage,
    isLoading,
    addMessage,
    setCurrentMessage,
    setLoading,
    clearMessages,
  } = useChatStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const simulateAIResponse = async (userMessage: string) => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock responses based on user input
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's an interesting point. Here's what I think about it...",
      "Based on your input, I'd suggest the following approach:",
      "Great question! Here's a detailed explanation:",
      "I can help you with that. Let me break it down for you:",
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    addMessage({
      role: 'assistant',
      content: randomResponse + " " + userMessage.split(' ').reverse().join(' '),
    })
    
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentMessage.trim() || isLoading) return

    const userMessage = currentMessage.trim()
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
    })
    
    // Clear input
    setCurrentMessage('')
    
    // Generate AI response
    await simulateAIResponse(userMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const syntheticEvent = e as unknown as React.FormEvent<HTMLFormElement>
      handleSubmit(syntheticEvent)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="size-5" />
          <span className="font-semibold">AI Assistant</span>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
        
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-xs"
          >
            Clear Chat
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <Bot className="size-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Ask me anything! I'm here to help with your questions.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingMessage />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!currentMessage.trim() || isLoading}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}