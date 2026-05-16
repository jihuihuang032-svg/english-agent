import { NextRequest, NextResponse } from 'next/server';
import { getDeepSeekAPI } from '@/lib/deepseek';
import { validateAccess } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authError = validateAccess(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const api = getDeepSeekAPI();
    const result = await api.correctEnglish(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Correct API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
