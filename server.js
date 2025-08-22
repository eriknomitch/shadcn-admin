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

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
  process.exit(1)
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Get environment variables
    const apiKey = process.env.AI_GATEWAY_API_KEY
    let model = process.env.AI_MODEL || 'gpt-3.5-turbo'
    
    // Override invalid models with valid OpenAI models
    if (model.includes('google/') || model.includes('gemini')) {
      model = 'gpt-3.5-turbo'
      console.log('Overriding invalid model with gpt-3.5-turbo')
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'AI_GATEWAY_API_KEY not configured' })
    }

    // Parse request body
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // Convert messages to the correct format if needed
    const formattedMessages = messages.map(msg => {
      // Handle different message formats
      if (msg.parts) {
        // Convert from parts format to content format
        const textPart = msg.parts.find(part => part.type === 'text')
        return {
          role: msg.role,
          content: textPart ? textPart.text : msg.content || ''
        }
      }
      
      // Already in correct format
      return {
        role: msg.role,
        content: msg.content || ''
      }
    })

    console.log('Processing chat request with', formattedMessages.length, 'messages')

    // Configure OpenAI with AI Gateway
    const result = streamText({
      model: openai(model, {
        apiKey,
        // Configure AI Gateway base URL if needed
        // baseURL: 'https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai',
      }),
      messages: formattedMessages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Stream the response to Express response object for chat UI
    result.pipeUIMessageStreamToResponse(res)

  } catch (error) {
    console.error('Chat API error:', error)
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error',
        details: error.message
      })
    }
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