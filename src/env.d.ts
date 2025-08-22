/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly AI_GATEWAY_API_KEY: string
  readonly AI_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}