"use client";

import { useStore } from "@/lib/store";
import { EXERCISES } from "@/lib/data/exercises";
import { ChevronLeft, Scale, Activity, TrendingUp, Circle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function WorkoutDetailPage() {
    const { id } = useParams();
    const { store, isInitialized, deleteWorkout } = useStore();
    const router = useRouter();

    if (!isInitialized) return null;

    const workout = store.history.find(w => w.id === id);

    if (!workout) {
        return (
            <div className="text-center py-20">
                <p>No se encontró el entrenamiento.</p>
                <Link href="/history" className="text-shred-neon underline">Volver al historial</Link>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm("¿Seguro que quieres eliminar este entrenamiento de forma permanente?")) {
            deleteWorkout(workout.id);
            router.push("/history");
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 -ml-2 text-white/40">
                        <ChevronLeft size={32} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black uppercase leading-tight truncate max-w-[200px]">{workout.name}</h1>
                        <p className="text-shred-neon font-black text-xs uppercase tracking-widest">
                            {format(new Date(workout.startAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 active:scale-90 transition-all"
                >
                    <Trash2 size={24} />
                </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="shred-card p-3 flex flex-col items-center text-center">
                    <Scale size={16} className="text-shred-blue mb-2" />
                    <span className="text-lg font-black">{workout.totalVolume}</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Kg Totales</span>
                </div>
                <div className="shred-card p-3 flex flex-col items-center text-center">
                    <Activity size={16} className="text-shred-neon mb-2" />
                    <span className="text-lg font-black">{workout.totalSets}</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Series</span>
                </div>
                <div className="shred-card p-3 flex flex-col items-center text-center">
                    <TrendingUp size={16} className="text-purple-500 mb-2" />
                    <span className="text-lg font-black">
                        {workout.endAt
                            ? Math.floor((new Date(workout.endAt).getTime() - new Date(workout.startAt).getTime()) / 60000)
                            : "--"}
                    </span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Minutos</span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {workout.entries.map((entry, i) => {
                    const exercise = EXERCISES.find(e => e.id === entry.exerciseId);
                    const isCardio = exercise?.category === "Cardio";
                    const isMobility = exercise?.category === "Movilidad";

                    const formatTime = (seconds?: number) => {
                        if (seconds === undefined) return "--";
                        const m = Math.floor(seconds / 60);
                        const s = seconds % 60;
                        return `${m}:${s.toString().padStart(2, "0")}`;
                    };

                    return (
                        <div key={i} className="shred-card overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 bg-shred-neon self-stretch rounded-full" />
                                <h3 className="text-xl font-black uppercase">{entry.exerciseName}</h3>
                            </div>

                            <div className="space-y-2">
                                {entry.sets.map((set, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-2 px-4 bg-white/5 rounded-xl border border-white/5">
                                        <span className="font-black text-white/40 tabular-nums uppercase text-[10px]">
                                            {isCardio || isMobility ? "Tramo" : "Serie"} {idx + 1}
                                        </span>
                                        <div className="flex gap-4">
                                            {set.weight !== undefined && (
                                                <span className="font-black">{set.weight} <span className="text-[10px] opacity-40">KG</span></span>
                                            )}
                                            {set.reps !== undefined && (
                                                <span className="font-black text-shred-neon">{set.reps} <span className="text-[10px] opacity-40">REPS</span></span>
                                            )}
                                            {set.durationSeconds !== undefined && (
                                                <span className="font-black text-shred-blue">{formatTime(set.durationSeconds)} <span className="text-[10px] opacity-40">MIN</span></span>
                                            )}
                                            {set.distanceKm !== undefined && (
                                                <span className="font-black text-shred-neon">{set.distanceKm.toFixed(1)} <span className="text-[10px] opacity-40">KM</span></span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
