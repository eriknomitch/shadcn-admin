import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// This is a Vite-compatible API endpoint for development
export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get environment variables
    const apiKey = process.env.AI_GATEWAY_API_KEY;
    const model = process.env.AI_MODEL || "gpt-4";

    if (!apiKey) {
      return new Response("AI_GATEWAY_API_KEY not configured", { status: 500 });
    }

    // Parse request body
    const { messages } = await request.json();

    // Pretty prtint the request body for debugging
    console.log("Received messages:", JSON.stringify(messages, null, 2));

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    console.log("Using model:", model);

    // Configure OpenAI with AI Gateway
    const result = streamText({
      model: openai(model, {
        apiKey,
        // If using AI Gateway, configure the base URL
        baseURL:
          "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
      }),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Return streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

