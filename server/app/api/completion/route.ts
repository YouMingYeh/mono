import { google } from '@ai-sdk/google';
import { generateText, streamText, tool } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    prompt,
    tools: {
      // server-side tool with execute function:
      webSearch: tool({
        description: 'Search the web for information.',
        parameters: z.object({
          query: z.string().describe('The search query.')
        }),
        execute: async (query) => {
          const text = await generateText({
            model: google('gemini-2.0-flash-001', {
              useSearchGrounding: true
            }),
            messages: [
              {
                role: 'user',
                content: `Search the web for ${query.query}`
              }
            ]
          });
          return text;
        }
      })
    },
    maxSteps: 5
  });

  const response = result.toDataStreamResponse();

  // Add CORS headers to the response
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Create a new response with the same body and status but with updated headers
  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
