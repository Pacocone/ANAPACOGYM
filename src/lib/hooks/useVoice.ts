"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { VoiceCommandParser, ParsedCommand } from "../voiceParser";

interface VoiceState {
    isListening: boolean;
    isProcessing: boolean;
    lastTranscript: string;
    error: string | null;
    notSupported: boolean;
}

export function useVoice(onCommand?: (command: ParsedCommand) => void, options: { continuous?: boolean } = {}) {
    const [state, setState] = useState<VoiceState>({
        isListening: false,
        isProcessing: false,
        lastTranscript: "",
        error: null,
        notSupported: false,
    });

    const recognitionRef = useRef<any>(null);
    const isContinuousRef = useRef(options.continuous);

    useEffect(() => {
        isContinuousRef.current = options.continuous;
    }, [options.continuous]);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setState(s => ({ ...s, notSupported: true }));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "es-ES";
        recognition.continuous = false; // We handle continuity manually for better control
        recognition.interimResults = true;

        recognition.onstart = () => {
            setState(s => ({ ...s, isListening: true, error: null }));
        };

        recognition.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join("");

            setState(s => ({ ...s, lastTranscript: transcript }));

            if (event.results[0].isFinal) {
                const command = VoiceCommandParser.parse(transcript);
                if (onCommand) onCommand(command);
                setState(s => ({ ...s, isListening: false, isProcessing: true }));

                setTimeout(() => {
                    setState(s => ({ ...s, isProcessing: false }));
                    if (isContinuousRef.current) {
                        recognition.start();
                    }
                }, 800);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error);
            setState(s => ({ ...s, isListening: false, error: event.error }));
        };

        recognition.onend = () => {
            setState(s => ({ ...s, isListening: false }));
        };

        recognitionRef.current = recognition;
    }, [onCommand]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !state.isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start listening error", e);
            }
        }
    }, [state.isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && state.isListening) {
            recognitionRef.current.stop();
        }
    }, [state.isListening]);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        // Stop previous speeches
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    }, []);

    return {
        ...state,
        startListening,
        stopListening,
        speak,
    };
}
