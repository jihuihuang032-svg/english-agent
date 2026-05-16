'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  needsHTTPS: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

type SpeechRecognitionInstance = InstanceType<Window['SpeechRecognition']>;

export function useSpeechRecognition(
  language: string = 'en-US'
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const needsHTTPS =
    typeof window !== 'undefined' &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      switch (event.error) {
        case 'no-speech':
          setError('未检测到语音，请重试');
          break;
        case 'audio-capture':
          setError('无法访问麦克风');
          break;
        case 'not-allowed':
          setError('麦克风权限被拒绝');
          break;
        case 'network':
          setError('网络错误');
          break;
        default:
          setError(`识别错误: ${event.error}`);
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      setInterimTranscript(interimText);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported, language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('启动语音识别失败');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error('Failed to stop recognition:', err);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    needsHTTPS,
    startListening,
    stopListening,
    resetTranscript,
  };
}
