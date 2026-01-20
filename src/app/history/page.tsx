"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ChevronRight, Activity, Clock, Trash2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Range = "DÍA" | "SEMANA" | "MES" | "AÑO" | "TODO";

export default function HistoryPage() {
    const { store, isInitialized, deleteWorkout, repeatWorkout } = useStore();
    const router = useRouter();
    const [range, setRange] = useState<Range>("TODO");

    if (!isInitialized) return null;

    const getDaysForRange = (r: Range) => {
        if (r === "DÍA") return 1;
        if (r === "SEMANA") return 7;
        if (r === "MES") return 30;
        if (r === "AÑO") return 365;
        return 99999;
    };

    const filteredHistory = store.history.filter(w => {
        if (range === "TODO") return true;
        const date = new Date(w.startAt);
        if (range === "DÍA") return isSameDay(date, new Date());

        const diff = Date.now() - date.getTime();
        return diff <= getDaysForRange(range) * 24 * 60 * 60 * 1000;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <h1 className="shred-title mb-0">HISTORIAL</h1>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {(["DÍA", "SEMANA", "MES", "AÑO", "TODO"] as Range[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={cn(
                                "px-2 py-1.5 rounded-lg text-[8px] font-black tracking-widest transition-all",
                                range === r ? "bg-shred-neon text-black" : "text-white/40"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {filteredHistory.length === 0 ? (
                    <div className="shred-card text-center py-20 opacity-40">
                        <Calendar className="mx-auto mb-4 opacity-20" size={48} />
                        <p className="text-xl font-bold italic">No hay entrenamientos en este periodo.</p>
                    </div>
                ) : (
                    filteredHistory.map((workout) => (
                        <div key={workout.id} className="relative group">
                            <Link
                                href={`/history/${workout.id}`}
                                className="shred-card block active:scale-[0.98] transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="pr-12">
                                        <h3 className="text-2xl font-black uppercase text-white group-hover:text-shred-neon transition-colors truncate max-w-[200px]">
                                            {workout.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-white/40 font-bold text-xs uppercase tracking-tighter mt-1">
                                            <Calendar size={12} />
                                            {format(new Date(workout.startAt), "EEEE d 'de' MMMM", { locale: es })}
                                        </div>
                                    </div>
                                    <div className="bg-shred-neon/10 text-shred-neon px-3 py-1 rounded-lg text-xs font-black uppercase">
                                        {workout.totalSets} SERIES
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-shred-blue">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black leading-none">{workout.totalVolume} <span className="text-[10px] opacity-40">KG</span></div>
                                            <div className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">VOLUMEN</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black leading-none">
                                                {workout.endAt
                                                    ? Math.floor((new Date(workout.endAt).getTime() - new Date(workout.startAt).getTime()) / 60000)
                                                    : "--"} <span className="text-[10px] opacity-40">MIN</span>
                                            </div>
                                            <div className="text-[8px] font-black uppercase text-white/40 tracking-widest mt-1">TIEMPO</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {workout.entries.slice(0, 3).map((e, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black flex items-center justify-center text-[10px] font-black uppercase">
                                                {e.exerciseName[0]}
                                            </div>
                                        ))}
                                        {workout.entries.length > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-shred-neon text-black border border-black flex items-center justify-center text-[10px] font-black">
                                                +{workout.entries.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="text-white/20 group-hover:text-shred-neon group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    repeatWorkout(workout.id);
                                    router.push("/workout");
                                }}
                                className="absolute top-4 right-24 p-2 text-white/20 hover:text-shred-neon transition-colors flex items-center gap-1 group/rep"
                            >
                                <RotateCcw size={16} className="group-hover/rep:rotate-[-45deg] transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/rep:opacity-100 transition-opacity">Repetir</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (confirm("¿Eliminar este entreno?")) deleteWorkout(workout.id);
                                }}
                                className="absolute top-4 right-14 p-2 text-white/20 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
