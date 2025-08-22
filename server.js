import express from 'express'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Get environment variables
    const apiKey = process.env.AI_GATEWAY_API_KEY
    const model = process.env.AI_MODEL || 'gpt-4'

    if (!apiKey) {
      return res.status(500).json({ error: 'AI_GATEWAY_API_KEY not configured' })
    }

    // Parse request body
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    console.log('Processing chat request with', messages.length, 'messages')

    // Configure OpenAI with AI Gateway
    const result = streamText({
      model: openai(model, {
        apiKey,
        // Configure AI Gateway base URL if needed
        // baseURL: 'https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai',
      }),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Return the streaming response directly
    const response = result.toDataStreamResponse()
    
    // Set appropriate headers for streaming
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    
    // Pipe the response
    const reader = response.body?.getReader()
    if (reader) {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(value)
        }
      } finally {
        reader.releaseLock()
        res.end()
      }
    } else {
      res.end()
    }

  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(port, () => {
  console.log(`AI Chat API server running on http://localhost:${port}`)
  console.log('Environment check:')
  console.log('- AI_GATEWAY_API_KEY:', process.env.AI_GATEWAY_API_KEY ? '✓ Set' : '✗ Missing')
  console.log('- AI_MODEL:', process.env.AI_MODEL || 'gpt-4 (default)')
})