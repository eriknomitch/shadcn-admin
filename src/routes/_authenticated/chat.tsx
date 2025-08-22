import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Loader } from "@/components/ui/loader";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { Source, SourceContent, SourceTrigger } from "@/components/ui/source";
import { Tool } from "@/components/ui/tool";
import {
  FileUpload,
  FileUploadContent,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Brain,
  Copy,
  Paperclip,
  Send,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ExtendedMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  reasoning?: string;
  sources?: Array<{ title: string; url: string; description: string }>;
  tools?: Array<
    {
      type: string;
      state:
      | "input-streaming"
      | "input-available"
      | "output-available"
      | "output-error";
      input: any;
      output: any;
      toolCallId: string;
    }
  >;
  isStreaming?: boolean;
}

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatPage,
});

function ChatPage() {
  // Connection status state
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Check server connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          setConnectionStatus("connected");
          setConnectionError(null);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Health check failed:", error);
        setConnectionStatus("error");
        setConnectionError(
          error instanceof Error ? error.message : "Unknown connection error",
        );
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Demo chat state for showcasing prompt-kit components
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! How can I help you today? I can assist with coding, analysis, research, and much more.",
      timestamp: new Date(),
      reasoning:
        "I should provide a friendly greeting and let the user know about my capabilities to encourage engagement.",
      sources: [
        {
          title: "AI Assistant Capabilities",
          url: "https://example.com/ai-capabilities",
          description: "Overview of AI assistant features and functionality",
        },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Mock handleSubmit for demo purposes
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input?.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage: ExtendedMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response after delay
    setTimeout(() => {
      const aiMessage: ExtendedMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          `Thank you for your message: "${input}". This is a demo response showcasing the prompt-kit components. In a real implementation, this would connect to your AI service.`,
        timestamp: new Date(),
        reasoning:
          "I should acknowledge the user's input and provide a helpful response while indicating this is a demo.",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const extendedMessages = messages;

  const suggestedPrompts = [
    "Explain a complex concept",
    "Help me debug some code",
    "Analyze this data",
    "Write a technical document",
    "Review my architecture",
  ];

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Custom submit handler to include file information
  const handleCustomSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input?.trim()) return;

    // Add file info to input if files are uploaded
    if (uploadedFiles.length > 0) {
      const contentWithFiles = input +
        `\n\n📎 ${uploadedFiles.length} file(s) attached: ${uploadedFiles.map((f) => f.name).join(", ")
        }`;
      setInput(contentWithFiles);
      setUploadedFiles([]);

      // Use setTimeout to allow the input update to take effect
      setTimeout(() => {
        handleSubmit?.(e);
      }, 0);
    } else {
      // Use the AI SDK's handleSubmit directly
      handleSubmit?.(e);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleFilesAdded = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen flex-col">
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
      <div className="flex-1 relative overflow-hidden">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="space-y-4 p-4 h-full overflow-y-auto min-h-0">
            {/* Connection Status */}
            {connectionStatus === "connecting" && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg">
                <p className="font-medium">Connecting to AI service...</p>
              </div>
            )}

            {connectionStatus === "error" && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg">
                <p className="font-medium">Connection Error</p>
                <p className="text-sm">
                  {connectionError || "Unable to connect to AI service"}
                </p>
                <p className="text-xs mt-1">
                  Please check if the server is running and environment
                  variables are configured.
                </p>
              </div>
            )}

            {/* Chat Errors */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg">
                <p className="font-medium">Chat Error</p>
                <p className="text-sm">{error.message}</p>
              </div>
            )}
            {extendedMessages.map((message) => (
              <Message key={message.id} className="flex gap-3">
                <MessageAvatar
                  src={message.role === "assistant" ? "" : ""}
                  alt={message.role === "assistant" ? "AI Assistant" : "User"}
                  fallback={message.role === "assistant" ? "AI" : "U"}
                />
                <div className="flex-1 space-y-2 min-w-0">
                  {/* Reasoning Section */}
                  {message.role === "assistant" && message.reasoning && (
                    <Reasoning isStreaming={message.isStreaming}>
                      <ReasoningTrigger>
                        <Brain className="w-4 h-4" />
                        AI Reasoning
                      </ReasoningTrigger>
                      <ReasoningContent markdown>
                        {message.reasoning}
                      </ReasoningContent>
                    </Reasoning>
                  )}

                  {/* Tool Usage */}
                  {message.role === "assistant" && message.tools &&
                    message.tools.length > 0 && (
                      <div className="space-y-2">
                        {message.tools.map((tool, index) => (
                          <Tool
                            key={tool.toolCallId}
                            toolPart={tool}
                            defaultOpen={index === 0}
                          />
                        ))}
                      </div>
                    )}

                  {/* Message Content */}
                  <MessageContent
                    markdown
                    className="prose prose-sm max-w-none"
                  >
                    {message.content}
                  </MessageContent>

                  {/* Sources */}
                  {message.role === "assistant" && message.sources &&
                    message.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.sources.map((source, index) => (
                          <Source key={index} href={source.url}>
                            <SourceTrigger label={source.title} showFavicon />
                            <SourceContent
                              title={source.title}
                              description={source.description}
                            />
                          </Source>
                        ))}
                      </div>
                    )}
                </div>

                {message.role === "assistant" && (
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
              <Message className="flex gap-3">
                <MessageAvatar
                  src=""
                  alt="AI Assistant"
                  fallback="AI"
                />
                <div className="rounded-lg p-3 text-foreground bg-secondary">
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

      {/* Prompt Suggestions */}
      {messages.length <= 1 && !input.trim() && (
        <div className="shrink-0 border-t bg-muted/30 p-4">
          <div className="mb-2 text-sm text-muted-foreground font-medium">
            Suggested prompts:
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <PromptSuggestion
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                size="sm"
                variant="secondary"
              >
                {prompt}
              </PromptSuggestion>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Area */}
      {uploadedFiles.length > 0 && (
        <div className="shrink-0 border-t bg-muted/30 p-4">
          <div className="mb-2 text-sm text-muted-foreground font-medium">
            Uploaded files:
          </div>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-sm"
              >
                <Paperclip className="w-4 h-4" />
                <span>{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-auto p-1"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="shrink-0 border-t bg-background backdrop-blur-sm supports-[backdrop-filter]:bg-background/95">
        <div className="p-4">
          <FileUpload
            onFilesAdded={handleFilesAdded}
            multiple
            accept=".txt,.md,.json,.csv,.pdf"
          >
            <form onSubmit={handleCustomSubmit}>
              <PromptInput
                value={input}
                onValueChange={(value) => setInput(value)}
                onSubmit={() => handleCustomSubmit()}
                isLoading={isLoading}
                className="min-h-[60px]"
              >
                <PromptInputTextarea
                  placeholder="Type your message here or drop files to upload OK HERE..."
                  className="resize-none"
                />
                <PromptInputActions>
                  <PromptInputAction tooltip="Upload files">
                    <FileUploadTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </FileUploadTrigger>
                  </PromptInputAction>
                  <PromptInputAction tooltip="Send message">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!input.trim() || isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCustomSubmit();
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </PromptInputAction>
                </PromptInputActions>
              </PromptInput>
            </form>
            <FileUploadContent>
              <div className="text-center p-8">
                <Paperclip className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold">
                  Drop files here to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports .txt, .md, .json, .csv, .pdf files
                </p>
              </div>
            </FileUploadContent>
          </FileUpload>
        </div>
      </div>
    </div>
  );
}

