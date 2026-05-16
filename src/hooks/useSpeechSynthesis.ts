'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, lang?: string) => Promise<void>;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    synthesisRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if (synthesisRef.current) {
        setVoices(synthesisRef.current.getVoices());
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
  }, [isSupported]);

  const speak = useCallback(
    async (text: string, lang: string = 'en-US'): Promise<void> => {
      if (!synthesisRef.current || !isSupported) {
        throw new Error('Speech synthesis not supported');
      }

      return new Promise((resolve, reject) => {
        synthesisRef.current!.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        const englishVoice = voices.find(
          (voice) =>
            voice.lang.startsWith('en') && voice.name.includes('Google')
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
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
    [isSupported, voices]
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
  };
}
