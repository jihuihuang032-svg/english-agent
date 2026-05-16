'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface VoiceSettings {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  englishVoices: SpeechSynthesisVoice[];
}

const VoiceContext = createContext<VoiceSettings | null>(null);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const english = voices.filter((v) => v.lang.startsWith('en'));
      setEnglishVoices(english);

      if (!selectedVoice && english.length > 0) {
        const femaleVoice = english.find(
          (v) =>
            v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Google UK English Female') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Female')
        );
        setSelectedVoice(femaleVoice?.name || english[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    const saved = localStorage.getItem('selected_voice');
    if (saved) setSelectedVoice(saved);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [selectedVoice]);

  const handleSetVoice = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('selected_voice', voice);
  };

  return (
    <VoiceContext.Provider
      value={{ selectedVoice, setSelectedVoice: handleSetVoice, englishVoices }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoiceSettings() {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoiceSettings must be used within VoiceProvider');
  }
  return context;
}
