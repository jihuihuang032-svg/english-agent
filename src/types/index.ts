export interface GrammarError {
  type: string;
  original: string;
  correction: string;
  explanation: string;
}

export interface GrammarResult {
  hasErrors: boolean;
  original: string;
  corrected: string;
  errors: GrammarError[];
  suggestions: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: Date;
  grammarResult?: GrammarResult;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ChatState {
  messages: Message[];
  currentScenario: Scenario | null;
  isLoading: boolean;
  corrections: Correction[];
}
