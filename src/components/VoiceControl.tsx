"use client";

import { useVoice } from "@/lib/hooks/useVoice";
import { useStore, storeActions } from "@/lib/store";
import { Mic, MicOff, X, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { ParsedCommand } from "@/lib/voiceParser";

export function VoiceControl() {
    const { store } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [pendingCommand, setPendingCommand] = useState<ParsedCommand | null>(null);

    // Audio state
    const isAudioMode = store.user.audioFeedbackEnabled ?? false;
    const isContinuous = store.user.voiceEnabled ?? false;

    const setIsAudioMode = (val: boolean) => storeActions.updateUser({ ...store.user, audioFeedbackEnabled: val });
    const setIsContinuous = (val: boolean) => storeActions.updateUser({ ...store.user, voiceEnabled: val });

    const executeCommand = useCallback((cmd: ParsedCommand) => {
        // CRITICAL: Always use the synchronous getter to avoid stale React state
        const currentStore = storeActions.getStore();

        switch (cmd.intent) {
            case "START_WORKOUT":
                if (!currentStore.activeWorkout) {
                    storeActions.startWorkout("Entrenamiento Voz");
                    if (isAudioMode) speak("Entrenamiento iniciado");
                }
                break;

            case "ADD_EXERCISE":
                if (!currentStore.activeWorkout) {
                    storeActions.startWorkout("Entrenamiento Voz");
                    // Defer exercise addition slightly to allow workout start to propagate to global state
                    setTimeout(() => storeActions.addExerciseToActive(cmd.params.exerciseId, cmd.params.exerciseName), 150);
                } else {
                    storeActions.addExerciseToActive(cmd.params.exerciseId, cmd.params.exerciseName);
                }
                if (isAudioMode) speak(`He añadido ${cmd.params.exerciseName}`);
                break;

            case "ADD_SET":
                if (currentStore.activeWorkout?.entries.length) {
                    const entries = currentStore.activeWorkout.entries;
                    const lastEntry = entries[entries.length - 1];
                    storeActions.addSetToEntry(lastEntry.id, cmd.params);
                    if (isAudioMode) speak(`Registrado ${cmd.params.reps} por ${cmd.params.weight} kilos`);
                } else {
                    if (isAudioMode) speak("Dime primero qué ejercicio estás haciendo");
                }
                break;

            case "UNDO":
                storeActions.undoLastSet();
                if (isAudioMode) speak("Deshecho");
                break;

            case "COUNTER":
                if (!currentStore.activeWorkout) storeActions.startWorkout("Entrenamiento Voz");
                storeActions.incrementCounter(cmd.params.type, cmd.params.count);
                if (isAudioMode) speak(`${cmd.params.count} registrados`);
                break;

            case "SET_WORKOUT_NAME":
                storeActions.updateWorkoutName(cmd.params.name);
                if (isAudioMode) speak(`Nombre cambiado a ${cmd.params.name}`);
                break;

            case "FINISH_WORKOUT":
                storeActions.finishWorkout();
                if (isAudioMode) speak("Entrenamiento guardado y finalizado");
                break;

            case "REST":
                if (isAudioMode) speak("Descanso iniciado");
                // Potential rest timer trigger here
                break;
        }

        setPendingCommand(cmd);
        setTimeout(() => setPendingCommand(null), 4000);
    }, [isAudioMode]);

    const lastProcessedTextRef = useRef<string>("");

    const handleCommand = useCallback((command: ParsedCommand) => {
        // Avoid double-processing of the same exact phrase
        if (command.raw === lastProcessedTextRef.current) return;
        lastProcessedTextRef.current = command.raw;

        const directIntents = ["START_WORKOUT", "UNDO", "FINISH_WORKOUT", "COUNTER", "ADD_EXERCISE", "ADD_SET", "SET_WORKOUT_NAME", "REST"];

        if (directIntents.includes(command.intent)) {
            executeCommand(command);
        }
    }, [executeCommand]);

    const { isListening, isProcessing, lastTranscript, error, notSupported, isPWAOnIOS, startListening, stopListening, speak } = useVoice(handleCommand, { continuous: isContinuous });

    if (notSupported && !isPWAOnIOS) return null;

    return (
        <>
            <button
                onClick={() => {
                    setShowModal(true);
                }}
                className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-shred-neon text-black flex items-center justify-center shadow-lg shadow-shred-neon/40 animate-bounce active:scale-95 z-50"
            >
                <Mic size={32} />
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col p-6 animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsAudioMode(!isAudioMode)}
                                    className={cn("p-3 rounded-xl transition-all", isAudioMode ? "bg-shred-neon text-black" : "bg-white/5 text-white/40")}
                                >
                                    {isAudioMode ? <Volume2 size={24} /> : <VolumeX size={24} />}
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    {isAudioMode ? "Feedback por voz" : "Sin audio"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsContinuous(!isContinuous)}
                                    className={cn("p-3 rounded-xl transition-all", isContinuous ? "bg-shred-blue text-black" : "bg-white/5 text-white/40")}
                                >
                                    <RotateCcw size={24} className={cn(isContinuous && "animate-spin-slow")} />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                    {isContinuous ? "Escucha Continua" : "Pulsar para hablar"}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white p-2">
                            <X size={32} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                        {isPWAOnIOS ? (
                            <div className="shred-card border-amber-500/50 p-8 max-w-xs">
                                <div className="text-amber-500 mb-4 flex justify-center"><VolumeX size={48} /></div>
                                <h3 className="text-xl font-black uppercase mb-2">Limitación de Apple</h3>
                                <p className="text-sm text-white/60">
                                    El sistema de voz de iOS no funciona en modo PWA.
                                    <br /><br />
                                    Abre **Safari** directamente para usar la voz.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className={cn(
                                    "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
                                    isListening ? "bg-shred-neon shadow-[0_0_50px_rgba(159,255,0,0.5)] scale-110" : "bg-white/5",
                                    error && "bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                                )}>
                                    {isListening ? <Mic size={48} className="text-black animate-pulse" /> : <MicOff size={48} className={cn("text-white/20", error && "text-red-500")} />}
                                </div>

                                <div className="space-y-4 max-w-sm">
                                    <h2 className="text-2xl font-black uppercase tracking-tight">
                                        {error ? "Fallo de Voz" : isListening ? "Escuchando..." : isProcessing ? "Procesando..." : "Listo para hablar"}
                                    </h2>
                                    {error ? (
                                        <div className="space-y-4">
                                            <div className="text-red-500 font-bold uppercase tracking-widest text-xs px-4 py-2 bg-red-500/10 rounded-lg">
                                                {error}
                                            </div>
                                            <div className="text-left bg-white/5 p-4 rounded-xl border border-white/5">
                                                <p className="text-[10px] font-black uppercase text-white/40 mb-2">Troubleshooting:</p>
                                                <ul className="text-[11px] text-white/60 space-y-2 list-disc pl-4">
                                                    <li>Usa **Safari** obligatoriamente.</li>
                                                    <li>Activa **Dictado** en Teclado.</li>
                                                    <li>Pulsa solo una vez para empezar.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-white/60 italic min-h-[3rem] px-4">
                                            "{lastTranscript || "Pulsa abajo para hablar..."}"
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {pendingCommand && pendingCommand.intent !== "UNKNOWN" && (
                            <div className="shred-card w-full border-shred-neon/50 animate-in slide-in-from-bottom duration-300">
                                <div className="text-[10px] uppercase font-black text-shred-neon tracking-widest mb-2">Acción Ejecutada</div>
                                <div className="text-xl font-black uppercase mb-4">
                                    {pendingCommand.intent === "ADD_SET" && `Registrado ${pendingCommand.params.reps} x ${pendingCommand.params.weight} kg`}
                                    {pendingCommand.intent === "ADD_EXERCISE" && `Añadido ${pendingCommand.params.exerciseName}`}
                                    {pendingCommand.intent === "START_WORKOUT" && "Entrenamiento iniciado"}
                                    {pendingCommand.intent === "FINISH_WORKOUT" && "Entrenamiento guardado"}
                                    {pendingCommand.intent === "UNDO" && "Borrado último registro"}
                                    {pendingCommand.intent === "COUNTER" && "Contador actualizado"}
                                </div>
                                <button onClick={() => { storeActions.undoLastSet(); setPendingCommand(null); }} className="w-full py-4 bg-white/5 rounded-2xl font-black uppercase text-xs border border-white/10 flex items-center justify-center gap-2">
                                    DESHACER / CORREGIR
                                </button>
                            </div>
                        )}
                    </div>

                    {!isPWAOnIOS && (
                        <div className="pb-10 px-4">
                            <button
                                onMouseDown={() => {
                                    lastProcessedTextRef.current = "";
                                    startListening();
                                }}
                                onMouseUp={stopListening}
                                onTouchStart={() => {
                                    lastProcessedTextRef.current = "";
                                    startListening();
                                }}
                                onTouchEnd={stopListening}
                                className={cn(
                                    "shred-button-xl transition-all duration-300",
                                    isListening ? "bg-red-500 shadow-red-500/30 scale-95" : "bg-shred-neon text-black shadow-shred-neon/30"
                                )}
                            >
                                {isListening ? "Suelta para procesar" : "Mantén para hablar"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
