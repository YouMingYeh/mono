import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const challengeSchema = z.object({
  day: z.number().describe('The day of the challenge from 1 to 30'),
  title: z.string().describe('The title of the challenge'),
  description: z.string().describe('The description of the challenge')
});
const challengesSchemas = z.array(challengeSchema);


export async function POST(req: NextRequest) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamObject({
    model: google('gemini-2.0-flash-001'),
    schema: challengesSchemas,
    prompt: `Generate a 30-day challenge for ${prompt}. Each day should have a title and description.`,
  });

  const response = result.toTextStreamResponse();

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
