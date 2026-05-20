'use client';

import { useState } from 'react';
import { speakingTemplates, SpeakingTemplate, ExpressionTemplate } from '@/data/speakingTemplates';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface SpeakingTemplatesProps {
  onBack: () => void;
}

export default function SpeakingTemplates({ onBack }: SpeakingTemplatesProps) {
  const [selectedScenario, setSelectedScenario] = useState<SpeakingTemplate | null>(null);
  const [expandedExpression, setExpandedExpression] = useState<string | null>(null);
  const { speak, isSpeaking, stop } = useSpeechSynthesis();

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      stop();
    } else {
      await speak(text);
    }
  };

  const handleBack = () => {
    if (selectedScenario) {
      setSelectedScenario(null);
      setExpandedExpression(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回</span>
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📝 口语模板
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedScenario ? (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <h2 className="font-semibold text-gray-800 mb-1">不知道怎么开口？</h2>
              <p className="text-sm text-gray-600">选择场景，学习常用表达模板，点击播放跟读练习</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {speakingTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedScenario(template)}
                  className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:shadow-md hover:border-purple-200 transition-all active:scale-[0.98]"
                >
                  <div className="text-3xl mb-2">{template.scenarioIcon}</div>
                  <h3 className="font-medium text-gray-800 text-sm">{template.scenario}</h3>
                  <p className="text-xs text-gray-500 mt-1">{template.expressions.length} 个表达</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedScenario.scenarioIcon}</span>
                <div>
                  <h2 className="font-semibold text-gray-800">{selectedScenario.scenario}</h2>
                  <p className="text-xs text-gray-600">点击句子可以播放发音，跟读练习</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {selectedScenario.expressions.map((expr, index) => (
                <ExpressionCard
                  key={expr.id}
                  expression={expr}
                  index={index + 1}
                  isExpanded={expandedExpression === expr.id}
                  isSpeaking={isSpeaking}
                  onToggle={() => setExpandedExpression(expandedExpression === expr.id ? null : expr.id)}
                  onSpeak={() => handleSpeak(expr.english.replace('____', '...'))}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ExpressionCard({
  expression,
  index,
  isExpanded,
  isSpeaking,
  onToggle,
  onSpeak,
}: {
  expression: ExpressionTemplate;
  index: number;
  isExpanded: boolean;
  isSpeaking: boolean;
  onToggle: () => void;
  onSpeak: () => void;
}) {
  const displayEnglish = expression.english.replace('____', '____');
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 font-medium">
              {displayEnglish.split('____').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded mx-0.5 text-xs">____</span>
                  )}
                </span>
              ))}
            </p>
            <p className="text-xs text-gray-500 mt-1">{expression.chinese}</p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {expression.tips && (
                <p className="text-xs text-gray-500 mb-2">💡 {expression.tips}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSpeaking
                  ? 'bg-red-100 text-red-600'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m0 0l-1.414-1.414m1.414 1.414L17 14m-6.536-5.536a5 5 0 000 7.072m0 0l1.414-1.414m-1.414 1.414L7 14m7-7l-5 5-5-5"
                />
              </svg>
              {isSpeaking ? '停止' : '播放'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
