"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { VoiceCommandParser, ParsedCommand } from "../voiceParser";

interface VoiceState {
    isListening: boolean;
    isProcessing: boolean;
    lastTranscript: string;
    error: string | null;
    notSupported: boolean;
    isPWAOnIOS: boolean;
}

export function useVoice(onCommand?: (command: ParsedCommand) => void, options: { continuous?: boolean } = {}) {
    const [state, setState] = useState<VoiceState>({
        isListening: false,
        isProcessing: false,
        lastTranscript: "",
        error: null,
        notSupported: false,
        isPWAOnIOS: false,
    });

    const recognitionRef = useRef<any>(null);
    const isContinuousRef = useRef(options.continuous);

    useEffect(() => {
        isContinuousRef.current = options.continuous;
    }, [options.continuous]);

    // Handle PWA detection on iOS
    useEffect(() => {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = (window.navigator as any).standalone || window.matchMedia("(display-mode: standalone)").matches;

        if (isIOS && isStandalone) {
            setState(s => ({ ...s, isPWAOnIOS: true, notSupported: true }));
        } else if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
            setState(s => ({ ...s, notSupported: true }));
        }
    }, []);

    const initRecognition = useCallback(() => {
        if (recognitionRef.current) return recognitionRef.current;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const recognition = new SpeechRecognition();
        recognition.lang = "es-ES";
        recognition.continuous = false;
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

            if (event.results[event.resultIndex].isFinal) {
                const command = VoiceCommandParser.parse(transcript);
                if (onCommand) onCommand(command);
                setState(s => ({ ...s, isListening: false, isProcessing: true }));

                setTimeout(() => {
                    setState(s => ({ ...s, isProcessing: false }));
                    if (isContinuousRef.current && recognitionRef.current) {
                        try {
                            recognitionRef.current.start();
                        } catch (e) {
                            console.warn("Auto-restart failed", e);
                        }
                    }
                }, 800);
            }
        };

        recognition.onerror = (event: any) => {
            let errorMessage = event.error;
            if (event.error === "not-allowed") errorMessage = "Permiso de micrófono denegado";
            if (event.error === "no-speech") errorMessage = "No se detectó voz";

            setState(s => ({ ...s, isListening: false, error: errorMessage }));
        };

        recognition.onend = () => {
            setState(s => ({ ...s, isListening: false }));
        };

        recognitionRef.current = recognition;
        return recognition;
    }, [onCommand]);

    const startListening = useCallback(() => {
        if (state.isPWAOnIOS) {
            setState(s => ({ ...s, error: "La voz no funciona en modo PWA en iOS. Abre Safari." }));
            return;
        }

        const rec = initRecognition();
        if (rec && !state.isListening) {
            try {
                // iOS requires user gesture for the FIRST start
                // We ensure this is called from an onClick/onTouchStart
                rec.start();
            } catch (e) {
                console.error("Start listening error", e);
                setState(s => ({ ...s, error: "Error al iniciar micrófono" }));
            }
        }
    }, [state.isListening, state.isPWAOnIOS, initRecognition]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && state.isListening) {
            recognitionRef.current.stop();
        }
    }, [state.isListening]);

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1.1; // Slightly faster for gym context
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
