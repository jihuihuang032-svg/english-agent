'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface GrammarError {
  type: string;
  original: string;
  correction: string;
  explanation: string;
}

interface GrammarResult {
  hasErrors: boolean;
  original: string;
  corrected: string;
  errors: GrammarError[];
  suggestions: string;
}

interface ChatFlowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onTranslate: (messageId: string) => Promise<void>;
  onGrammarCheck?: (text: string) => Promise<GrammarResult>;
}

export default function ChatFlow({
  messages,
  isLoading,
  onSendMessage,
  onTranslate,
  onGrammarCheck,
}: ChatFlowProps) {
  const [input, setInput] = useState('');
  const [showGrammarTip, setShowGrammarTip] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarResult | null>(null);
  const [checkingGrammar, setCheckingGrammar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: speechSupported,
    needsHTTPS,
    startListening,
    stopListening,
  } = useSpeechRecognition('en-US');

  const {
    isSpeaking,
    isSupported: synthesisSupported,
    speak,
    stop: stopSpeaking,
  } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (interimTranscript) {
      setInput(transcript + interimTranscript);
    }
  }, [interimTranscript, transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const messageText = input.trim();
      
      if (onGrammarCheck) {
        setCheckingGrammar(true);
        try {
          const result = await onGrammarCheck(messageText);
          setGrammarResult(result);
          if (result.hasErrors) {
            setShowGrammarTip(true);
          }
        } catch (error) {
          console.error('Grammar check failed:', error);
        } finally {
          setCheckingGrammar(false);
        }
      }
      
      onSendMessage(messageText);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      try {
        await speak(text, 'en-US');
      } catch (error) {
        console.error('Speech synthesis failed:', error);
      }
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-400 mb-2">选择场景后开始对话</p>
              <p className="text-sm text-gray-400 mb-4">
                用英语与 AI 进行口语练习
              </p>
              {speechSupported && (
                <div className="flex items-center justify-center gap-2 text-xs text-blue-500">
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
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01.469-1.57m0 0a3 3 0 012.931-1.57A3 3 0 0114 8.5V11m0 0V8.5m0 0h3m-3 0h-3"
                    />
                  </svg>
                  <span>支持语音输入</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white rounded-2xl rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                } px-4 py-2`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.translation && (
                  <div className="mt-2 pt-2 border-t border-gray-300/30">
                    <p className="text-xs opacity-80">{message.translation}</p>
                  </div>
                )}
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-2">
                    {!message.translation && (
                      <button
                        onClick={() => onTranslate(message.id)}
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0118 14.5m-2.46-6.46a4.5 4.5 0 011.38 3.85m-3.84 3.84a4.5 4.5 0 01-3.85-1.38m3.84-3.84L21 3"
                          />
                        </svg>
                        翻译
                      </button>
                    )}
                    {synthesisSupported && (
                      <button
                        onClick={() => handleSpeak(message.content)}
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m0 0l-1.414-1.414m1.414 1.414L17 14m-6.536-5.536a5 5 0 000 7.072m0 0l1.414-1.414m-1.414 1.414L7 14m7-7l-5 5-5-5"
                          />
                        </svg>
                        {isSpeaking ? '停止' : '播放'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showGrammarTip && grammarResult && grammarResult.hasErrors && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-yellow-800 mb-1">
                💡 语法提示
              </p>
              <p className="text-xs text-yellow-700">
                {grammarResult.suggestions}
              </p>
              {grammarResult.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {grammarResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="text-xs bg-white p-2 rounded border border-yellow-200"
                    >
                      <span className="text-red-600 line-through">
                        {error.original}
                      </span>
                      <span className="mx-1">→</span>
                      <span className="text-green-600 font-medium">
                        {error.correction}
                      </span>
                      <p className="text-gray-600 mt-1">
                        {error.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowGrammarTip(false)}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {needsHTTPS && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800">
            ⚠️ 语音功能需要 HTTPS 连接。请使用 ngrok 或类似工具创建 HTTPS 隧道。
          </p>
        </div>
      )}

      {speechError && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-xs text-red-600">{speechError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-3 bg-white border-t">
        <div className="flex gap-2">
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`px-3 py-2 rounded-full transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01.469-1.57m0 0a3 3 0 012.931-1.57A3 3 0 0114 8.5V11m0 0V8.5m0 0h3m-3 0h-3"
                />
              </svg>
            </button>
          )}
          <input
            ref={inputRef}
            type="text"
            value={input || (isListening ? interimTranscript : '')}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isListening ? '正在听...' : '输入英语消息或点击麦克风说话'
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            type="submit"
            disabled={
              (!input.trim() && !interimTranscript) ||
              isLoading ||
              checkingGrammar
            }
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {checkingGrammar ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.392M20 20v-5h-.392M4 4a4 4 0 014-4h8a4 4 0 014 4v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4z"
                />
              </svg>
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
        {isListening && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>正在录音...</span>
          </div>
        )}
      </form>
    </div>
  );
}
