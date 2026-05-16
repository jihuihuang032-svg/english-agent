import { NextRequest, NextResponse } from 'next/server';
import { getDeepSeekAPI, DeepSeekMessage } from '@/lib/deepseek';
import { validateAccess } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authError = validateAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { messages, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const api = getDeepSeekAPI();
    const response = await api.chat(
      messages as DeepSeekMessage[],
      temperature || 0.7,
      maxTokens || 1000
    );

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
