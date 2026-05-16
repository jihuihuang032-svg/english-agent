'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useVoiceSettings } from '@/contexts/VoiceContext';

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string) => Promise<void>;
  stop: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const { selectedVoice } = useVoiceSettings();

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [isSupported]);

  const speak = useCallback(
    async (text: string): Promise<void> => {
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

        if (selectedVoice) {
          const voices = synthesisRef.current!.getVoices();
          const voice = voices.find((v) => v.name === selectedVoice);
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
    [isSupported, selectedVoice]
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
  };
}
