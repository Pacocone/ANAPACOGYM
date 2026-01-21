"use client";

import { useVoice } from "@/lib/hooks/useVoice";
import { useStore } from "@/lib/store";
import { Mic, MicOff, X, Check, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ParsedCommand } from "@/lib/voiceParser";

export function VoiceControl() {
    const { store, addExerciseToActive, addSetToEntry, undoLastSet, incrementCounter, finishWorkout, updateWorkoutName, updateUser, startWorkout } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [pendingCommand, setPendingCommand] = useState<ParsedCommand | null>(null);

    const isAudioMode = store.user.audioFeedbackEnabled ?? false;
    const isContinuous = store.user.voiceEnabled ?? false;

    const setIsAudioMode = (val: boolean) => updateUser({ ...store.user, audioFeedbackEnabled: val });
    const setIsContinuous = (val: boolean) => updateUser({ ...store.user, voiceEnabled: val });

    const executeCommand = useCallback((cmd: ParsedCommand) => {
        switch (cmd.intent) {
            case "ADD_EXERCISE":
                if (!store.activeWorkout) {
                    startWorkout("Entrenamiento Voz");
                    setTimeout(() => addExerciseToActive(cmd.params.exerciseId, cmd.params.exerciseName), 100);
                } else {
                    addExerciseToActive(cmd.params.exerciseId, cmd.params.exerciseName);
                }
                if (isAudioMode) speak(`Añadido ${cmd.params.exerciseName}`);
                break;
            case "ADD_SET":
                if (store.activeWorkout?.entries.length) {
                    const entries = store.activeWorkout.entries;
                    const lastEntry = entries[entries.length - 1];
                    addSetToEntry(lastEntry.id, cmd.params);
                    if (isAudioMode) speak(`Registrado ${cmd.params.reps} con ${cmd.params.weight} kilos`);
                } else {
                    if (isAudioMode) speak("Primero dime qué ejercicio estas haciendo");
                }
                break;
            case "UNDO":
                undoLastSet();
                if (isAudioMode) speak("Deshecho");
                break;
            case "COUNTER":
                if (!store.activeWorkout) startWorkout("Entrenamiento Voz");
                incrementCounter(cmd.params.type, cmd.params.count);
                if (isAudioMode) speak(`${cmd.params.count} ${cmd.params.type === 'squats' ? 'sentadillas' : 'abdominales'} registrados`);
                break;
            case "SET_WORKOUT_NAME":
                updateWorkoutName(cmd.params.name);
                if (isAudioMode) speak(`Nombre cambiado a ${cmd.params.name}`);
                break;
            case "FINISH_WORKOUT":
                finishWorkout();
                if (isAudioMode) speak("Entrenamiento finalizado");
                break;
        }
        setPendingCommand(null);
    }, [store.activeWorkout, isAudioMode, addExerciseToActive, addSetToEntry, undoLastSet, incrementCounter, finishWorkout, updateWorkoutName, startWorkout]);

    const handleCommand = useCallback((command: ParsedCommand) => {
        if (pendingCommand) {
            if (command.intent === "CONFIRM") {
                executeCommand(pendingCommand);
                return;
            }
            if (command.intent === "REJECT") {
                setPendingCommand(null);
                if (isAudioMode) speak("Cancelado");
                return;
            }
        }

        const directIntents = ["START_WORKOUT", "UNDO", "FINISH_WORKOUT", "COUNTER"];
        if (directIntents.includes(command.intent)) {
            executeCommand(command);
            return;
        }

        if (command.intent === "ADD_SET" || command.intent === "ADD_EXERCISE") {
            setPendingCommand(command);
            if (isAudioMode) {
                if (command.intent === "ADD_SET") speak(`¿Confirmo ${command.params.reps} reps con ${command.params.weight} kg?`);
                if (command.intent === "ADD_EXERCISE") speak(`¿Confirmo ejercicio ${command.params.exerciseName}?`);
            }
        }
    }, [pendingCommand, isAudioMode, executeCommand]);

    const { isListening, isProcessing, lastTranscript, error, notSupported, isPWAOnIOS, startListening, stopListening, speak } = useVoice(handleCommand, { continuous: isContinuous });

    if (notSupported && !isPWAOnIOS) return null;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
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
                                    El sistema de voz de iOS no funciona en modo PWA (icono escritorio).
                                    <br /><br />
                                    Para usar la voz, abre **Safari** directamente y entra en la web.
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
                                                <p className="text-[10px] font-black uppercase text-white/40 mb-2">Pasos para arreglarlo:</p>
                                                <ul className="text-[11px] text-white/60 space-y-2 list-disc pl-4">
                                                    <li>Asegúrate de estar en **Safari** (no PWA/Escritorio).</li>
                                                    <li>Ve a **Ajustes {'>'} Teclado** y activa **Dictado**.</li>
                                                    <li>Ve a **Ajustes {'>'} Privacidad {'>'} Reconocimiento de voz** y permite Safari.</li>
                                                    <li>Recarga la página de la aplicación.</li>
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-white/60 italic min-h-[3rem]">
                                            "{lastTranscript || "Pulsa abajo para hablar..."}"
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {pendingCommand && pendingCommand.intent !== "UNKNOWN" && (
                            <div className="shred-card w-full border-shred-neon/50 animate-in slide-in-from-bottom duration-300">
                                <div className="text-[10px] uppercase font-black text-shred-neon tracking-widest mb-2">Comando Interpretado</div>
                                <div className="text-xl font-black uppercase mb-4">
                                    {pendingCommand.intent === "ADD_SET" && `Registrar ${pendingCommand.params.reps} reps x ${pendingCommand.params.weight} kg`}
                                    {pendingCommand.intent === "ADD_EXERCISE" && `Añadir ${pendingCommand.params.exerciseName}`}
                                    {pendingCommand.intent === "COUNTER" && `Sumar ${pendingCommand.params.count} ${pendingCommand.params.type}`}
                                    {pendingCommand.intent === "SET_WORKOUT_NAME" && `Nombre: ${pendingCommand.params.name}`}
                                </div>
                                <p className="text-[10px] text-white/40 uppercase font-bold mb-6 italic">Diga "Sí" para confirmar o "No" para cancelar</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setPendingCommand(null)} className="flex-1 py-4 bg-white/5 rounded-2xl font-black uppercase text-xs border border-white/10">Corregir</button>
                                    <button onClick={() => executeCommand(pendingCommand)} className="flex-1 py-4 bg-shred-neon text-black rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2">
                                        <Check size={18} /> Confirmar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pb-10 px-4">
                        <button
                            onMouseDown={startListening}
                            onMouseUp={stopListening}
                            onTouchStart={startListening}
                            onTouchEnd={stopListening}
                            className={cn(
                                "shred-button-xl transition-all duration-300",
                                isListening ? "bg-red-500 shadow-red-500/30 scale-95" : "bg-shred-neon text-black shadow-shred-neon/30"
                            )}
                        >
                            {isListening ? "Suelta para procesar" : "Mantén para hablar"}
                        </button>
                        <p className="text-center mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            Prueba: "70 kilos por 10" o "Ejercicio Press Banca"
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
