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
    const onCommandRef = useRef(onCommand);

    useEffect(() => {
        isContinuousRef.current = options.continuous;
    }, [options.continuous]);

    useEffect(() => {
        onCommandRef.current = onCommand;
    }, [onCommand]);

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
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            setState(s => ({ ...s, lastTranscript: transcript }));

            if (event.results[event.resultIndex].isFinal) {
                const finalTranscript = transcript.trim();
                if (finalTranscript) {
                    const command = VoiceCommandParser.parse(finalTranscript);
                    if (onCommandRef.current) onCommandRef.current(command);
                }

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
                }, 400);
            }
        };

        recognition.onerror = (event: any) => {
            let errorMessage = event.error;
            if (event.error === "not-allowed") errorMessage = "Permiso denegado (Ajustes > Privacidad > Micro)";
            if (event.error === "service-not-allowed") errorMessage = "Dictado desactivado (Ajustes > Gen > Teclado > Dictado)";
            if (event.error === "no-speech") errorMessage = "No se detectó voz";

            setState(s => ({ ...s, isListening: false, error: errorMessage }));
        };

        recognition.onend = () => {
            setState(s => ({ ...s, isListening: false }));
        };

        recognitionRef.current = recognition;
        return recognition;
    }, []); // Removed onCommand dependency because we use onCommandRef

    const startListening = useCallback(() => {
        if (state.isPWAOnIOS) {
            setState(s => ({ ...s, error: "La voz no funciona en modo PWA en iOS. Abre Safari." }));
            return;
        }

        const rec = initRecognition();
        if (rec && !state.isListening) {
            try {
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
        utterance.rate = 1.1;
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
