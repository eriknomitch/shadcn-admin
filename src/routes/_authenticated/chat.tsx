import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ChatContainerRoot, 
  ChatContainerContent, 
  ChatContainerScrollAnchor 
} from '@/components/ui/chat-container'
import { 
  PromptInput, 
  PromptInputTextarea, 
  PromptInputActions, 
  PromptInputAction 
} from '@/components/ui/prompt-input'
import { Message, MessageAvatar, MessageContent, MessageActions, MessageAction } from '@/components/ui/message'
import { ScrollButton } from '@/components/ui/scroll-button'
import { Loader } from '@/components/ui/loader'
import { Send, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export const Route = createFileRoute('/_authenticated/chat')({
  component: ChatPage,
})

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your message: "${userMessage.content}". This is a demo response using prompt-kit components. The interface now uses professional, well-designed components specifically built for AI chat applications.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbPage>AI Chat</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 relative">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="space-y-4 p-4">
            {messages.map((message) => (
              <Message key={message.id}>
                <MessageAvatar
                  src={message.role === 'assistant' ? '' : ''}
                  alt={message.role === 'assistant' ? 'AI Assistant' : 'User'}
                  fallback={message.role === 'assistant' ? 'AI' : 'U'}
                />
                <MessageContent markdown>
                  {message.content}
                </MessageContent>
                {message.role === 'assistant' && (
                  <MessageActions>
                    <MessageAction tooltip="Copy message">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyMessage(message.content)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Like this response">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Dislike this response">
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))}
            
            {isLoading && (
              <Message>
                <MessageAvatar
                  src=""
                  alt="AI Assistant"
                  fallback="AI"
                />
                <div className="rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal">
                  <Loader variant="typing" />
                </div>
              </Message>
            )}
          </ChatContainerContent>
          <ChatContainerScrollAnchor />
          
          {/* Scroll Button */}
          <div className="absolute right-4 bottom-24">
            <ScrollButton className="shadow-lg" />
          </div>
        </ChatContainerRoot>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <PromptInput
            value={inputValue}
            onValueChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            className="min-h-[60px]"
          >
            <PromptInputTextarea
              placeholder="Type your message here..."
              className="resize-none"
            />
            <PromptInputActions>
              <PromptInputAction tooltip="Send message">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}