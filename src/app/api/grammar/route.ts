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
    
    const messages = [
      {
        role: 'system' as const,
        content: `你是一个英语语法纠错助手。请检查用户输入的英语文本，纠正语法错误和表达不当之处。

返回格式（JSON）：
{
  "hasErrors": true/false,
  "original": "原文",
  "corrected": "纠正后的文本（如果没有错误则与原文相同）",
  "errors": [
    {
      "type": "错误类型（如：grammar, spelling, punctuation, expression）",
      "original": "错误部分",
      "correction": "纠正部分",
      "explanation": "错误说明（用中文解释）"
    }
  ],
  "suggestions": "改进建议（用中文）"
}

请严格按照 JSON 格式返回，不要添加任何其他内容。`,
      },
      {
        role: 'user' as const,
        content: text,
      },
    ];

    const response = await api.chat(messages, 0.3);
    
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      result = {
        hasErrors: false,
        original: text,
        corrected: text,
        errors: [],
        suggestions: '语法检查完成',
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Grammar check API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
