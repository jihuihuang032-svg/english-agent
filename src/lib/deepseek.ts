const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekAPI {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'deepseek-chat') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async chat(
    messages: DeepSeekMessage[],
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<string> {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`DeepSeek API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API call failed:', error);
      throw error;
    }
  }

  async translateToChinese(englishText: string): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: '你是一个翻译助手，请将用户输入的英文翻译成中文。只返回翻译结果，不要添加任何解释。',
      },
      {
        role: 'user',
        content: englishText,
      },
    ];

    return this.chat(messages, 0.3);
  }

  async correctChinese(chineseText: string): Promise<{
    corrected: string;
    explanation: string;
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `你是一个中文纠错助手。请检查用户输入的中文文本，纠正语法错误和表达不当之处。
返回格式：
纠正后的文本：[纠正后的文本]
解释：[错误说明和纠正原因]

如果文本正确，请返回：
纠正后的文本：[原文]
解释：文本正确，无需修改。`,
      },
      {
        role: 'user',
        content: chineseText,
      },
    ];

    const response = await this.chat(messages, 0.3);
    
    const correctedMatch = response.match(/纠正后的文本：(.+)/);
    const explanationMatch = response.match(/解释：([\s\S]+)/);
    
    return {
      corrected: correctedMatch?.[1]?.trim() || chineseText,
      explanation: explanationMatch?.[1]?.trim() || '无法解析解释',
    };
  }

  async correctEnglish(englishText: string): Promise<{
    corrected: string;
    explanation: string;
  }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `你是一个英语语法纠错助手。请检查用户输入的英语文本，纠正语法错误和表达不当之处。

重要规则：
1. 忽略标点符号问题（用户使用语音输入，标点可能不准确）
2. 只检查真正的语法错误、拼写错误、表达不当
3. 不要纠正标点符号的缺失或错误

返回格式：
纠正后的文本：[纠正后的文本]
解释：[错误说明和纠正原因，用中文]

如果文本正确，请返回：
纠正后的文本：[原文]
解释：文本正确，无需修改。`,
      },
      {
        role: 'user',
        content: englishText,
      },
    ];

    const response = await this.chat(messages, 0.3);
    
    const correctedMatch = response.match(/纠正后的文本：(.+)/);
    const explanationMatch = response.match(/解释：([\s\S]+)/);
    
    return {
      corrected: correctedMatch?.[1]?.trim() || englishText,
      explanation: explanationMatch?.[1]?.trim() || '无法解析解释',
    };
  }
}

let apiInstance: DeepSeekAPI | null = null;

export function getDeepSeekAPI(): DeepSeekAPI {
  if (!apiInstance) {
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!apiKey) {
      console.warn('DEEPSEEK_API_KEY not found in environment variables');
    }
    apiInstance = new DeepSeekAPI(apiKey);
  }
  return apiInstance;
}

export function setDeepSeekAPIKey(apiKey: string): void {
  apiInstance = new DeepSeekAPI(apiKey);
}
