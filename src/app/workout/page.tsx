"use client";

import { useStore } from "@/lib/store";
import { EXERCISES } from "@/lib/data/exercises";
import { Plus, Check, ChevronLeft, Timer, Trash2, Copy, Play, Pause, ChevronUp, ChevronDown, CheckCircle2, Search, Edit2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExerciseIcon } from "@/components/ui/ExerciseIcon";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Todos", "Brazos", "CABLE MAQUINA", "Cardio", "Core", "Espalda", "Hombros", "Mancuernas", "Movilidad", "Pecho", "Piernas"] as const;

export default function WorkoutPage() {
    const { store, addExerciseToActive, addSetToEntry, finishWorkout, isInitialized, getLastSessionData, discardActiveWorkout, updateWorkoutName } = useStore();
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const [showExercises, setShowExercises] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>("Todos");

    const [activeSetTimer, setActiveSetTimer] = useState<{ id: string, start: number } | null>(null);
    const [setElapsedSeconds, setSetElapsedSeconds] = useState(0);

    const [inputWeight, setInputWeight] = useState(40);
    const [inputReps, setInputReps] = useState(10);
    const [inputDistance, setInputDistance] = useState(0);
    const [inputDuration, setInputDuration] = useState(0); // in minutes for cardio/mobility manual input

    const router = useRouter();

    useEffect(() => {
        if (!store.activeWorkout && isInitialized) {
            router.push("/");
        }
        const timer = setInterval(() => {
            if (store.activeWorkout) {
                const start = new Date(store.activeWorkout.startAt).getTime();
                setElapsed(Math.floor((Date.now() - start) / 1000));
            }
            if (activeSetTimer) {
                setSetElapsedSeconds(Math.floor((Date.now() - activeSetTimer.start) / 1000));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [store.activeWorkout, isInitialized, router, activeSetTimer]);

    if (!isInitialized || !store.activeWorkout) return null;

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const startSet = (entryId: string) => {
        setActiveSetTimer({ id: entryId, start: Date.now() });
        setSetElapsedSeconds(0);
    };

    const stopSet = (entryId: string, category: string) => {
        const data: any = {};
        if (category === "Movilidad") {
            data.durationSeconds = setElapsedSeconds;
        } else if (category === "Cardio") {
            data.durationSeconds = setElapsedSeconds;
            data.distanceKm = inputDistance;
        } else {
            data.weight = inputWeight;
            data.reps = inputReps;
        }

        addSetToEntry(entryId, data);
        setActiveSetTimer(null);
        setSetElapsedSeconds(0);
    };

    const handleAddExercise = (ex: any) => {
        addExerciseToActive(ex.id, ex.name);
        const lastData = getLastSessionData(ex.id);
        if (lastData) {
            if (lastData.weight !== undefined) setInputWeight(lastData.weight);
            if (lastData.reps !== undefined) setInputReps(lastData.reps);
            if (lastData.distanceKm !== undefined) setInputDistance(lastData.distanceKm);
        }
        setShowExercises(false);
        setSearch("");
    };

    const modalFiltered = EXERCISES.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col gap-6 pb-20">
            {/* Header Fijo */}
            <div className="flex justify-between items-center bg-black/80 backdrop-blur-xl sticky top-0 py-4 z-40 px-4 -mx-4 border-b border-white/5">
                <Link href="/" className="p-2 text-white/40 hover:text-white transition-colors">
                    <ChevronLeft size={32} />
                </Link>
                <div className="flex flex-col items-center flex-1 mx-2">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 w-full max-w-[200px]">
                            <input
                                autoFocus
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => {
                                    updateWorkoutName(tempName || "Entrenamiento");
                                    setIsEditingName(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        updateWorkoutName(tempName || "Entrenamiento");
                                        setIsEditingName(false);
                                    }
                                }}
                                className="bg-white/10 border border-shred-neon/30 rounded-lg px-2 py-1 text-sm font-black w-full text-center outline-none text-shred-neon"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setTempName(store.activeWorkout?.name || "");
                                setIsEditingName(true);
                            }}
                            className="flex items-center gap-2 group"
                        >
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/40 group-hover:text-shred-neon transition-colors">
                                {store.activeWorkout?.name || "Entrenamiento"}
                            </span>
                            <Edit2 size={10} className="text-white/20 group-hover:text-shred-neon transition-colors" />
                        </button>
                    )}
                    <div className="text-shred-neon font-black text-4xl tabular-nums tracking-tighter shadow-shred-neon">
                        {formatTime(elapsed)}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (confirm("¿Seguro que quieres descartar este entrenamiento? No se guardarán los datos.")) {
                                discardActiveWorkout();
                                router.push("/");
                            }
                        }}
                        className="bg-white/5 text-white/40 px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={() => {
                            finishWorkout();
                            router.push("/");
                        }}
                        className="bg-shred-neon text-black px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(159,255,0,0.3)] active:scale-95 transition-all"
                    >
                        Finalizar
                    </button>
                </div>
            </div>

            {/* Listado de Aparatos */}
            <div className="flex flex-col gap-8">
                {store.activeWorkout.entries.map((entry) => {
                    const exercise = EXERCISES.find(e => e.id === entry.exerciseId);
                    const isTiming = activeSetTimer?.id === entry.id;
                    const cat = exercise?.category || "";

                    return (
                        <div key={entry.id} className="shred-card border-t-2 border-t-shred-neon relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                    {exercise?.imageUrl ? (
                                        <img src={exercise.imageUrl} alt={entry.exerciseName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-shred-neon">
                                            <ExerciseIcon type={exercise?.iconType || ""} size={28} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase leading-none mb-1">{entry.exerciseName}</h3>
                                    <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">{exercise?.category}</p>
                                </div>
                            </div>

                            {/* Control de Serie */}
                            <div className="mb-8 space-y-6">
                                {isTiming ? (
                                    <div className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-shred-blue/5 border border-shred-blue/20">
                                        <div className="text-5xl font-black text-shred-blue tabular-nums tracking-tighter drop-shadow-[0_0_10px_rgba(0,224,255,0.3)]">
                                            {formatTime(setElapsedSeconds)}
                                        </div>
                                        {cat === "Cardio" && (
                                            <div className="w-full space-y-2">
                                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block text-center">Distancia Recorrida (KM)</label>
                                                <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-2 h-16">
                                                    <button onClick={() => setInputDistance(prev => Math.max(0, prev - 0.1))} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronDown size={28} /></button>
                                                    <span className="text-3xl font-black tracking-tighter">{inputDistance.toFixed(1)}</span>
                                                    <button onClick={() => setInputDistance(prev => prev + 0.1)} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronUp size={28} /></button>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => stopSet(entry.id, cat)}
                                            className="w-full h-20 bg-red-600 text-white rounded-[1.5rem] font-black uppercase text-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] active:scale-95 transition-all"
                                        >
                                            <Pause fill="currentColor" size={28} /> TERMINAR
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => startSet(entry.id)}
                                        className="w-full h-20 bg-shred-blue text-black rounded-[1.5rem] font-black uppercase text-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,224,255,0.3)] active:scale-95 transition-all"
                                    >
                                        <Play fill="currentColor" size={28} /> {cat === "Movilidad" || cat === "Cardio" ? "INICIAR" : "EMPEZAR SERIE"}
                                    </button>
                                )}

                                {/* Inputs específicos por categoría (Solo cuando no está midiendo) */}
                                {(!isTiming && cat !== "Movilidad" && cat !== "Cardio") && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block text-center">Peso Objetivo (KG)</label>
                                            <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-2 h-16">
                                                <button onClick={() => setInputWeight(prev => Math.max(0, prev - 2.5))} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronDown size={28} /></button>
                                                <span className="text-3xl font-black tracking-tighter">{inputWeight}</span>
                                                <button onClick={() => setInputWeight(prev => prev + 2.5)} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronUp size={28} /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] block text-center">Repeticiones</label>
                                            <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-2 h-16">
                                                <button onClick={() => setInputReps(prev => Math.max(0, prev - 1))} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronDown size={28} /></button>
                                                <span className="text-3xl font-black tracking-tighter">{inputReps}</span>
                                                <button onClick={() => setInputReps(prev => prev + 1)} className="w-12 h-full flex items-center justify-center text-shred-neon active:scale-75 transition-transform"><ChevronUp size={28} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Historial de Series */}
                            <div className="space-y-2 border-t border-white/5 pt-6">
                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Registro</h4>
                                {entry.sets.length === 0 && <p className="text-xs text-white/10 font-bold italic py-4">Aún no hay registros...</p>}
                                {entry.sets.map((set, idx) => (
                                    <div key={set.id} className="flex justify-between items-center py-4 px-5 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-colors animate-in fade-in slide-in-from-left duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-shred-neon/20 flex items-center justify-center text-[10px] font-black text-shred-neon">
                                                {idx + 1}
                                            </div>
                                            <span className="font-black text-xs text-white/40 uppercase">
                                                {cat === "Movilidad" || cat === "Cardio" ? "Tramo" : "Serie"}
                                            </span>
                                        </div>
                                        <div className="flex gap-6 items-center">
                                            {set.weight !== undefined && (
                                                <div className="text-right">
                                                    <div className="text-xl font-black leading-none">{set.weight}<span className="text-[10px] ml-1 opacity-20">KG</span></div>
                                                </div>
                                            )}
                                            {set.reps !== undefined && (
                                                <div className="text-right">
                                                    <div className="text-xl font-black leading-none text-shred-neon">{set.reps}<span className="text-[10px] ml-1 opacity-20">REPS</span></div>
                                                </div>
                                            )}
                                            {set.durationSeconds !== undefined && (
                                                <div className="text-right">
                                                    <div className="text-xl font-black leading-none">{formatTime(set.durationSeconds)}</div>
                                                </div>
                                            )}
                                            {set.distanceKm !== undefined && (
                                                <div className="text-right">
                                                    <div className="text-xl font-black leading-none text-shred-neon">{set.distanceKm.toFixed(1)}<span className="text-[10px] ml-1 opacity-20">KM</span></div>
                                                </div>
                                            )}
                                            <CheckCircle2 size={20} className="text-shred-neon opacity-40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Añadir Aparato */}
            <div className="pb-12 pt-6">
                <button
                    onClick={() => setShowExercises(true)}
                    className="shred-button-xl bg-transparent border-2 border-dashed border-white/10 text-white/40 hover:border-shred-neon hover:text-shred-neon group transition-all"
                >
                    <Plus className="mr-3 group-hover:rotate-90 transition-transform" strokeWidth={3} /> AÑADIR EJERCICIO
                </button>
            </div>

            {/* Modal de Selección */}
            {showExercises && (
                <div className="fixed inset-0 bg-black/98 z-[100] p-6 pt-20 overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-4xl font-black uppercase">SELECCIONAR</h2>
                        <button onClick={() => setShowExercises(false)} className="text-shred-neon font-black uppercase tracking-widest text-xs underline">Cerrar</button>
                    </div>

                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input
                            type="text"
                            placeholder="BUSCAR..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-black focus:border-shred-neon outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-6 -mx-2 px-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all whitespace-nowrap",
                                    selectedCategory === cat ? "bg-shred-neon text-black border-shred-neon" : "bg-white/5 text-white/40 border-white/10"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {modalFiltered.map(ex => (
                            <button
                                key={ex.id}
                                onClick={() => handleAddExercise(ex)}
                                className="shred-card flex items-center gap-5 text-left p-4 hover:border-shred-neon/30 group transition-all"
                            >
                                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 group-hover:scale-105 transition-transform shrink-0">
                                    {ex.imageUrl ? (
                                        <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-shred-neon">
                                            <ExerciseIcon type={ex.iconType} size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-shred-neon uppercase tracking-widest mb-1">{ex.category}</div>
                                    <div className="font-black uppercase tracking-tight text-xl">{ex.name}</div>
                                    <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{ex.equipment}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
