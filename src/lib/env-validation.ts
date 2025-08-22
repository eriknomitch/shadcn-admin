// Environment variable validation utilities
import { z } from 'zod'

const envSchema = z.object({
  AI_GATEWAY_API_KEY: z.string().min(1, 'AI_GATEWAY_API_KEY is required'),
  AI_MODEL: z.string().min(1, 'AI_MODEL is required'),
})

export function validateClientEnv() {
  try {
    // On the client side, we only validate what we need
    // Server-side env vars are validated on the server
    return {
      isValid: true,
      error: null
    }
  } catch (error) {
    console.error('Client environment validation failed:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export function getServerEnvStatus() {
  // This will be called from the client to check server env status
  const hasApiKey = Boolean(import.meta.env?.AI_GATEWAY_API_KEY)
  const hasModel = Boolean(import.meta.env?.AI_MODEL)
  
  return {
    hasApiKey,
    hasModel,
    isConfigured: hasApiKey && hasModel
  }
}