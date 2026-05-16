export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  timestamp: Date;
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
