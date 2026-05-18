'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, Scenario, Correction, GrammarResult } from '@/types';
import { scenarios } from '@/data/scenarios';
import ScenarioSelector from '@/components/ScenarioSelector';
import ChatFlow from '@/components/ChatFlow';
import CorrectionPanel from '@/components/CorrectionPanel';
import { useVoiceSettings } from '@/contexts/VoiceContext';

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCorrectionPanel, setShowCorrectionPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  
  const { selectedVoice, setSelectedVoice, englishVoices } = useVoiceSettings();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('access_token');
      if (savedToken) {
        setAccessToken(savedToken);
      }
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
    async (content: string, grammarResult?: GrammarResult) => {
      if (!selectedScenario) return;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
        grammarResult,
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
    <main className="fixed inset-0 overflow-hidden">
      <div className="h-full max-w-md mx-auto flex flex-col">
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 safe-area-top">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">英语口语练习</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
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
            <div className="mt-3 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">
                  访问令牌（可选，用于保护 API）
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="输入令牌..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 space-y-6">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <span className="text-4xl">🗣️</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  英语口语练习
                </h1>
                <p className="text-sm text-gray-500">选择场景，开始你的英语之旅</p>
              </div>

              {englishVoices.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <span className="text-lg">🔊</span>
                      播放语音
                    </span>
                    <button
                      onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                      className="text-xs text-blue-500 hover:text-blue-600"
                    >
                      {showVoiceSelector ? '收起' : '更换'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    当前：{selectedVoice.replace('Microsoft ', '').replace('Google ', '').substring(0, 20)}
                  </p>
                  {showVoiceSelector && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {englishVoices.map((voice) => (
                        <button
                          key={voice.name}
                          onClick={() => setSelectedVoice(voice.name)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                            selectedVoice === voice.name
                              ? 'bg-blue-500 text-white'
                              : 'bg-white hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {voice.name.replace('Microsoft ', '').replace('Google ', '')}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <ScenarioSelector
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelect={handleSelectScenario}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between">
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

            <div className="flex-1 overflow-hidden min-h-0">
              <ChatFlow
                messages={messages}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onTranslate={handleTranslate}
                onGrammarCheck={handleGrammarCheck}
              />
            </div>

            <div className="flex-shrink-0 bg-white border-t border-gray-200 safe-area-bottom">
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
                  英语纠错
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
