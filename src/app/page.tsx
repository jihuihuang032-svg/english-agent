'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, Scenario, Correction } from '@/types';
import { scenarios } from '@/data/scenarios';
import ScenarioSelector from '@/components/ScenarioSelector';
import ChatFlow from '@/components/ChatFlow';
import CorrectionPanel from '@/components/CorrectionPanel';

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCorrectionPanel, setShowCorrectionPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const getAuthHeaders = useCallback(() => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return headers;
  }, [accessToken]);

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedScenario) return;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            messages: [
              { role: 'system', content: selectedScenario.systemPrompt },
              ...messages.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              { role: 'user', content },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: '抱歉，发生了错误。请检查 API 配置或稍后重试。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedScenario, messages, getAuthHeaders]
  );

  const handleTranslate = useCallback(async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.translation) return;

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: message.content }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, translation: data.translation } : m
        )
      );
    } catch (error) {
      console.error('Translation error:', error);
    }
  }, [messages, getAuthHeaders]);

  const handleCorrect = useCallback(async (text: string): Promise<Correction> => {
    const response = await fetch('/api/correct', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Correction failed');
    }

    const data = await response.json();
    const correction: Correction = {
      original: text,
      corrected: data.corrected,
      explanation: data.explanation,
    };

    setCorrections((prev) => [...prev, correction]);
    return correction;
  }, [getAuthHeaders]);

  const handleClearCorrections = useCallback(() => {
    setCorrections([]);
  }, []);

  const handleGrammarCheck = useCallback(async (text: string) => {
    const response = await fetch('/api/grammar', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Grammar check failed');
    }

    return await response.json();
  }, [getAuthHeaders]);

  const handleSelectScenario = useCallback((scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([]);
  }, []);

  const handleSaveToken = useCallback(() => {
    if (accessToken.trim()) {
      localStorage.setItem('access_token', accessToken.trim());
      setShowSettings(false);
    }
  }, [accessToken]);

  const handleClearToken = useCallback(() => {
    localStorage.removeItem('access_token');
    setAccessToken('');
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">英语口语练习</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="设置"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.065 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.065c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.065-2.573c-.94-1.543.826-3.31 2.37-2.37.996.622 2.03 1.032 2.573 1.065.426.426 1.756 2.924 1.756 3.35 0 .426-.426.426-.426.426z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          {showSettings && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2">
                  访问令牌（可选，用于保护 API）
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="输入令牌..."
                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSaveToken}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    保存
                  </button>
                </div>
                {localStorage.getItem('access_token') && (
                  <button
                    onClick={handleClearToken}
                    className="mt-2 text-xs text-red-500 hover:text-red-600"
                  >
                    清除已保存的令牌
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">
                提示：如果服务端设置了 ACCESS_TOKEN 环境变量，需要在此输入相同的令牌才能访问 API。
              </p>
            </div>
          )}
        </header>

        {!selectedScenario ? (
          <div className="flex-1 overflow-y-auto p-4">
            <ScenarioSelector
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              onSelect={handleSelectScenario}
            />
          </div>
        ) : (
          <>
            <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedScenario.icon}</span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedScenario.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                切换场景
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatFlow
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onTranslate={handleTranslate}
                onGrammarCheck={handleGrammarCheck}
              />
            </div>

            <div className="bg-white border-t border-gray-200">
              <button
                onClick={() => setShowCorrectionPanel(!showCorrectionPanel)}
                className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  中文纠错
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showCorrectionPanel ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showCorrectionPanel && (
                <div className="p-4 border-t border-gray-200">
                  <CorrectionPanel
                    corrections={corrections}
                    onCorrect={handleCorrect}
                    onClear={handleClearCorrections}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
