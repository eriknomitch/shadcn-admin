# AI Chat Feature

An integrated AI chatbot component that provides intelligent assistance within the application.

## Features

- **Collapsible Sheet Interface**: Opens as an overlay from the right side
- **Floating Action Button**: Always-accessible chat trigger in bottom-right corner
- **Keyboard Shortcuts**: 
  - `Cmd/Ctrl + K` to toggle chat
  - `Escape` to close chat when open
- **Message Persistence**: Chat history is saved using Zustand persist middleware
- **Responsive Design**: Full-width on mobile, fixed width on desktop
- **Mock AI Integration**: Simulated AI responses (ready for real API integration)

## Components

### `useChatStore` (Zustand Store)
- Manages chat state (open/closed, messages, loading states)
- Persists message history to localStorage
- Provides actions for message management

### `AIChatbot` Component
- Main chat interface with message display
- Auto-scrolling conversation
- Typing indicators and loading states
- Message input with send button

### `ChatTrigger` Component
- Floating action button trigger
- Sheet wrapper for the chatbot
- Keyboard shortcut handling
- Unread message badge display

## Integration

The chat feature is integrated into the main `AuthenticatedLayout` and is available across all authenticated routes.

## Future Enhancements

- Real AI provider integration (OpenAI, Anthropic, etc.)
- Message streaming
- File attachments
- Chat history search
- User preferences and settings