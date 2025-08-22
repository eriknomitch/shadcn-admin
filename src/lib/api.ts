// API utilities for server-side functionality
import type { UIMessage } from '@ai-sdk/react'

// Environment validation
function validateEnv() {
  const apiKey = import.meta.env?.AI_GATEWAY_API_KEY
  const model = import.meta.env?.AI_MODEL

  if (!apiKey) {
    throw new Error('AI_GATEWAY_API_KEY environment variable is required')
  }
  
  if (!model) {
    throw new Error('AI_MODEL environment variable is required')
  }

  return { apiKey, model }
}

// Chat API endpoint for development
export async function callChatAPI(messages: UIMessage[]): Promise<Response> {
  // In development, we'll call a local API endpoint
  // In production, this would be handled by a proper server
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
  }

  return response
}

// Utility to get environment variables safely
export function getEnvVars() {
  try {
    return validateEnv()
  } catch (error) {
    console.error('Environment validation failed:', error)
    throw error
  }
}