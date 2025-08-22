# AI Chat Components Archive

This folder contains the original AI chat implementation that was replaced with prompt-kit components.

## Archived Components

- `ai-chatbot.tsx` - Original chatbot component with custom implementation
- `chat-trigger.tsx` - Chat trigger button for opening/closing chat
- `chat-store.ts` - Zustand store for chat state management
- `README.md` - Original documentation

## Replacement

These components have been replaced with a new chat interface built using prompt-kit components for better performance, design consistency, and maintenance.

The new implementation can be found in:
- Chat interface: `src/routes/_authenticated/chat.tsx`
- prompt-kit components: `src/components/prompt-kit/`

## Why Archived

- Preserve existing work for future reference
- Allow easy rollback if needed during transition
- Document the evolution of the chat feature
- Keep custom implementations for potential future use

Date archived: $(date)