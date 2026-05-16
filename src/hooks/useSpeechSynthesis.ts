'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, voiceName?: string) => Promise<void>;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
  englishVoices: SpeechSynthesisVoice[];
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const englishVoices = voices.filter((voice) => voice.lang.startsWith('en'));

  useEffect(() => {
    if (!isSupported) return;

    synthesisRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if (synthesisRef.current) {
        const allVoices = synthesisRef.current.getVoices();
        setVoices(allVoices);
        
        if (!selectedVoice) {
          const englishVoice = allVoices.find(
            (voice) =>
              voice.lang.startsWith('en') && 
              (voice.name.includes('Samantha') || 
               voice.name.includes('Karen') ||
               voice.name.includes('Google UK English Female') ||
               voice.name.includes('Microsoft Zira') ||
               voice.name.includes('Female'))
          ) || allVoices.find((v) => v.lang.startsWith('en'));
          
          if (englishVoice) {
            setSelectedVoice(englishVoice.name);
          }
        }
      }
    };

    loadVoices();
    synthesisRef.current.addEventListener('voiceschanged', loadVoices);

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.removeEventListener('voiceschanged', loadVoices);
        synthesisRef.current.cancel();
      }
    };
  }, [isSupported, selectedVoice]);

  const speak = useCallback(
    async (text: string, voiceName?: string): Promise<void> => {
      if (!synthesisRef.current || !isSupported) {
        throw new Error('Speech synthesis not supported');
      }

      return new Promise((resolve, reject) => {
        synthesisRef.current!.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voiceToUse = voiceName || selectedVoice;
        if (voiceToUse) {
          const voice = voices.find((v) => v.name === voiceToUse);
          if (voice) {
            utterance.voice = voice;
          }
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        synthesisRef.current!.speak(utterance);
      });
    },
    [isSupported, voices, selectedVoice]
  );

  const stop = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    voices,
    englishVoices,
    selectedVoice,
    setSelectedVoice,
  };
}
