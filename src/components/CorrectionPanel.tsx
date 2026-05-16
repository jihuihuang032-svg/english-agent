'use client';

import { useState } from 'react';
import { Correction } from '@/types';

interface CorrectionPanelProps {
  corrections: Correction[];
  onCorrect: (text: string) => Promise<Correction>;
  onClear: () => void;
}

export default function CorrectionPanel({
  corrections,
  onCorrect,
  onClear,
}: CorrectionPanelProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      try {
        await onCorrect(input.trim());
        setInput('');
      } catch (error) {
        console.error('Correction failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-orange-500"
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
          中文纠错提示区
        </h3>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入中文文本进行纠错..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100 text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isLoading ? '检查中...' : '纠错'}
            </button>
          </div>
        </form>

        {corrections.length > 0 ? (
          <div className="space-y-3">
            {corrections.map((correction, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">原文：</p>
                  <p className="text-sm text-gray-700">{correction.original}</p>
                </div>
                {correction.corrected !== correction.original && (
                  <div className="mb-2">
                    <p className="text-xs text-green-600 mb-1">纠正后：</p>
                    <p className="text-sm text-green-700 font-medium">
                      {correction.corrected}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-blue-600 mb-1">说明：</p>
                  <p className="text-sm text-gray-600">{correction.explanation}</p>
                </div>
              </div>
            ))}
            <button
              onClick={onClear}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              清空记录
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            输入中文文本，AI 将帮助检查语法和表达
          </p>
        )}
      </div>
    </div>
  );
}
