"use client";

import { useStore } from "@/lib/store";
import { EXERCISES } from "@/lib/data/exercises";
import { Search, PlayCircle, Plus, ChevronRight, X, Filter } from "lucide-react";
import { useState } from "react";
import { ExerciseIcon } from "@/components/ui/ExerciseIcon";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Todos", "Brazos", "CABLE MAQUINA", "Cardio", "Core", "Espalda", "Hombros", "Mancuernas", "Movilidad", "Pecho", "Piernas"] as const;

export default function ExercisesPage() {
    const { addExerciseToActive, store } = useStore();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>("Todos");
    const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISES[0] | null>(null);

    const filtered = EXERCISES.filter(ex => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
            ex.searchKeywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = selectedCategory === "Todos" || ex.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col gap-8 pb-10">
            <section>
                <h1 className="shred-title text-5xl mb-6">BIBLIOTECA</h1>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={24} />
                    <input
                        type="text"
                        placeholder="BUSCAR EJERCICIO..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 font-black text-lg focus:border-shred-neon outline-none transition-all placeholder:text-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Categories (Group Division) */}
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap border",
                                selectedCategory === cat
                                    ? "bg-shred-neon text-black border-shred-neon shadow-[0_0_15px_rgba(159,255,0,0.3)]"
                                    : "bg-white/5 text-white/40 border-white/10 hover:border-white/20"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Exercise List */}
            <div className="flex flex-col gap-4">
                {filtered.map((ex) => (
                    <button
                        key={ex.id}
                        onClick={() => setSelectedExercise(ex)}
                        className="shred-card flex items-center justify-between group active:scale-98 transition-all p-5 bg-gradient-to-r from-white/5 to-transparent hover:from-white/10"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                                {ex.imageUrl ? (
                                    <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-shred-neon/30">
                                        <ExerciseIcon type={ex.iconType} size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] uppercase font-black text-shred-neon tracking-[0.2em] mb-1">{ex.category}</div>
                                <div className="text-xl font-black uppercase tracking-tight leading-none mb-1">{ex.name}</div>
                                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{ex.equipment}</div>
                            </div>
                        </div>
                        <ChevronRight className="text-white/10 group-hover:text-shred-neon group-hover:translate-x-1 transition-all" size={24} />
                    </button>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedExercise && (
                <div className="fixed inset-0 bg-black/98 z-[100] p-6 overflow-y-auto pt-20 animate-in fade-in duration-300">
                    <button
                        onClick={() => setSelectedExercise(null)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                        <X size={28} />
                    </button>

                    <div className="max-w-xl mx-auto">
                        <div className="mb-10 text-center">
                            <div className="w-52 h-52 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6 mx-auto border border-white/10 overflow-hidden shadow-2xl">
                                {selectedExercise.imageUrl ? (
                                    <img src={selectedExercise.imageUrl} alt={selectedExercise.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="bg-shred-neon/10 w-full h-full flex items-center justify-center text-shred-neon">
                                        <ExerciseIcon type={selectedExercise.iconType} size={64} />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-4xl font-black uppercase leading-tight mb-2">{selectedExercise.name}</h2>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-shred-neon text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-shred-neon/10 rounded-full">{selectedCategory}</span>
                                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{selectedCategory === "Todos" ? selectedExercise.equipment : selectedExercise.equipment}</span>
                            </div>
                        </div>

                        {/* Embedded Video */}
                        <div className="aspect-video w-full bg-black rounded-[2.5rem] border border-white/10 relative overflow-hidden mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {selectedExercise.videoUrl ? (
                                <iframe
                                    src={selectedExercise.videoUrl}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-white/10">
                                    <PlayCircle size={64} strokeWidth={1} />
                                    <span className="font-black uppercase tracking-widest text-xs">Video próximamente</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-10">
                            <section>
                                <h4 className="text-shred-neon font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-shred-neon" /> TÉCNICA ÉLITE
                                </h4>
                                <div className="space-y-4">
                                    {selectedExercise.tips.map((tip, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <span className="text-shred-neon font-black text-lg">0{i + 1}</span>
                                            <p className="text-white/70 text-sm font-bold leading-relaxed">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h4 className="text-red-500 font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <div className="h-[2px] w-8 bg-red-500" /> EVITAR
                                </h4>
                                <div className="space-y-3">
                                    {selectedExercise.commonMistakes.map((err, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                                            <X className="text-red-500 shrink-0" size={18} />
                                            <p className="text-white/50 text-sm font-bold italic">{err}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {store.activeWorkout && (
                                <div className="pt-6 pb-20">
                                    <button
                                        onClick={() => {
                                            addExerciseToActive(selectedExercise.id, selectedExercise.name);
                                            setSelectedExercise(null);
                                        }}
                                        className="shred-button-xl shred-button-primary shred-neon-glow"
                                    >
                                        <Plus className="mr-3" strokeWidth={3} /> AÑADIR A SESIÓN
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
