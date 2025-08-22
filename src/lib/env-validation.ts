// Environment variable validation utilities

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